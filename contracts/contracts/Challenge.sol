// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "./interfaces/IVerifier.sol";
import "./libraries/Errors.sol";
import "./libraries/DataTypes.sol";

/**
 * Contract to start, finalize, and participate in challenges.
 */
contract Challenge is ERC721Upgradeable, OwnableUpgradeable {
    using Counters for Counters.Counter;

    event ParamsSet(uint256 indexed tokenId, DataTypes.ChallengeParams params);
    event ParticipantSet(
        uint256 indexed tokenId,
        address indexed participantAccountAddress,
        DataTypes.ChallengeParticipant participant
    );

    address private _verifierAddress;
    Counters.Counter private _counter;
    mapping(uint256 => DataTypes.ChallengeParams) private _params;
    mapping(uint256 => mapping(string => string)) _verificationData;
    mapping(uint256 => DataTypes.ChallengeParticipant[]) private _participants;

    function initialize(address verifierAddress) public initializer {
        __ERC721_init("Web3 Challenges", "W3C");
        __Ownable_init();
        _verifierAddress = verifierAddress;
    }

    /// ***************************
    /// ***** OWNER FUNCTIONS *****
    /// ***************************

    function setVerifierAddress(address verifierAddress) public onlyOwner {
        _verifierAddress = verifierAddress;
    }

    /// *****************************
    /// ***** CREATOR FUNCTIONS *****
    /// *****************************

    function start(
        uint256 duration,
        string memory hashtag,
        string memory handle,
        string memory description,
        uint256 prize,
        uint256 deadline
    ) public payable returns (uint256) {
        // Base checks
        if (msg.value != prize) revert Errors.MessageValueMismatch();
        if (prize <= 0) revert Errors.PrizeInvalid();
        if (_verifierAddress == address(0)) revert Errors.VerifierNotFound();
        // Update counter
        _counter.increment();
        // Mint token
        uint256 newTokenId = _counter.current();
        _mint(msg.sender, newTokenId);
        // Set params
        DataTypes.ChallengeParams memory tokenParams = DataTypes
            .ChallengeParams(
                block.timestamp,
                msg.sender,
                duration,
                hashtag,
                handle,
                description,
                prize,
                deadline,
                false
            );
        _params[newTokenId] = tokenParams;
        emit ParamsSet(newTokenId, tokenParams);
        // Return
        return newTokenId;
    }

    function finalize(uint tokenId) public {
        // TODO:
    }

    /// *********************************
    /// ***** PARTICIPANT FUNCTIONS *****
    /// *********************************

    function participate(uint256 tokenId, string memory handle) public {
        // Base Checks
        if (!_exists(tokenId)) revert Errors.TokenDoesNotExist();
        if (_params[tokenId].isFinalized) revert Errors.ChallengeFinalized();
        for (uint i = 0; i < _participants[tokenId].length; i++) {
            if (_participants[tokenId][i].accountAddress == msg.sender) {
                revert Errors.AlreadyParticipant();
            }
        }
        // Add participant
        DataTypes.ChallengeParticipant memory tokenParticipant = DataTypes
            .ChallengeParticipant(
                block.timestamp,
                msg.sender,
                handle,
                false,
                false
            );
        _participants[tokenId].push(tokenParticipant);
        emit ParticipantSet(
            tokenId,
            tokenParticipant.accountAddress,
            tokenParticipant
        );
    }

    function verify(uint256 tokenId) public {
        // Base Checks
        if (!_exists(tokenId)) revert Errors.TokenDoesNotExist();
        if (_params[tokenId].isFinalized) revert Errors.ChallengeFinalized();
        // Check participant
        DataTypes.ChallengeParticipant memory tokenParticipant;
        for (uint i = 0; i < _participants[tokenId].length; i++) {
            if (_participants[tokenId][i].accountAddress == msg.sender) {
                tokenParticipant = _participants[tokenId][i];
            }
        }
        if (tokenParticipant.accountAddress == address(0))
            revert Errors.NotParticipant();
        // Verify
        IVerifier(_verifierAddress).verifyChallengeCompletion(
            tokenId,
            _params[tokenId].duration,
            _params[tokenId].hashtag,
            _params[tokenId].handle,
            tokenParticipant.handle
        );
    }

    // TODO:
    function complete(uint256 tokenId) public {
        // Base Checks
        if (!_exists(tokenId)) revert Errors.TokenDoesNotExist();
        if (_params[tokenId].isFinalized) revert Errors.ChallengeFinalized();
        // Check participant
        DataTypes.ChallengeParticipant memory tokenParticipant;
        for (uint i = 0; i < _participants[tokenId].length; i++) {
            if (_participants[tokenId][i].accountAddress == msg.sender) {
                tokenParticipant = _participants[tokenId][i];
            }
        }
        // Check verification status
    }

    /// *********************************
    /// ***** PUBLIC VIEW FUNCTIONS *****
    /// *********************************

    function getVerifierAddress() public view returns (address) {
        return _verifierAddress;
    }

    function getCurrentCounter() public view returns (uint) {
        return _counter.current();
    }

    function getParams(
        uint256 tokenId
    ) public view returns (DataTypes.ChallengeParams memory) {
        return _params[tokenId];
    }

    function getParticipants(
        uint256 tokenId
    ) public view returns (DataTypes.ChallengeParticipant[] memory) {
        return _participants[tokenId];
    }

    function isChallengeCompleted(uint256 tokenId) public view returns (bool) {
        // Base Checks
        if (!_exists(tokenId)) revert Errors.TokenDoesNotExist();
        if (_params[tokenId].isFinalized) revert Errors.ChallengeFinalized();
        // Check participant
        DataTypes.ChallengeParticipant memory tokenParticipant;
        for (uint i = 0; i < _participants[tokenId].length; i++) {
            if (_participants[tokenId][i].accountAddress == msg.sender) {
                tokenParticipant = _participants[tokenId][i];
            }
        }
        return
            IVerifier(_verifierAddress).isChallengeCompleted(
                tokenId,
                tokenParticipant.handle
            );
    }

    function tokenURI(
        uint256 tokenId
    ) public pure override returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        abi.encodePacked(
                            '{"name":"Web3 Challenge #',
                            Strings.toString(tokenId),
                            '"}'
                        )
                    )
                )
            );
    }

    /// ******************************
    /// ***** INTERNAL FUNCTIONS *****
    /// ******************************

    /**
     * Hook that is called before any token transfer.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override(ERC721Upgradeable) {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
        // Disable transfers except minting
        if (from != address(0)) revert Errors.TokenNotTransferable();
    }
}
