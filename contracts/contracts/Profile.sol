// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./libraries/Errors.sol";

/**
 * Contract to store accounts profile data.
 */
contract Profile is ERC721URIStorageUpgradeable {
    using Counters for Counters.Counter;

    event URISet(uint256 indexed tokenId, string tokenURI);

    Counters.Counter private _counter;
    mapping(address => uint256) private _owners;

    function initialize() public initializer {
        __ERC721_init("Web3 Challenges Profiles", "W3CP");
    }

    /**
     * Get token id by owner.
     */
    function getTokenId(address owner) external view returns (uint) {
        return _owners[owner];
    }

    /**
     * Get uri by owner.
     */
    function getURI(address owner) external view returns (string memory) {
        uint256 tokenId = _owners[owner];
        if (_exists(tokenId)) {
            return tokenURI(tokenId);
        } else {
            return "";
        }
    }

    /**
     * Set uri for sender's token.
     */
    function setURI(string memory tokenURI) public {
        // Mint token if sender does not have it yet
        if (_owners[msg.sender] == 0) {
            // Update counter
            _counter.increment();
            // Mint token
            uint256 tokenId = _counter.current();
            _mint(msg.sender, tokenId);
            _owners[msg.sender] = tokenId;
            // Set URI
            _setURI(tokenId, tokenURI);
        }
        // Set URI if sender already have token
        else {
            _setURI(_owners[msg.sender], tokenURI);
        }
    }

    /**
     * Set uri.
     */
    function _setURI(uint256 tokenId, string memory tokenURI) private {
        _setTokenURI(tokenId, tokenURI);
        emit URISet(tokenId, tokenURI);
    }

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
