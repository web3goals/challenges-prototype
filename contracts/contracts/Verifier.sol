// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interfaces/IVerifier.sol";
import "./libraries/Errors.sol";

/**
 * Contract to verify challenge completion by twitter handle using chainlink oracle.
 */
contract Verifier is IVerifier, ChainlinkClient {
    using Chainlink for Chainlink.Request;

    struct RequestParams {
        uint256 challengeTokenId;
        string participantHandle;
    }

    event ChallengeCompletionVerified(
        bytes32 indexed requestId,
        uint256 challengeTokenId,
        string participantHandle
    );
    event ChallengeCompletionNotVerified(
        bytes32 indexed requestId,
        uint256 challengeTokenId,
        string participantHandle
    );

    address internal _challengeAddress;
    bytes32 private _jobId;
    uint256 private _fee;
    mapping(bytes32 => RequestParams) private _requestParams;
    mapping(uint256 => mapping(string => bool))
        internal _participantHandlesWithCompletedChallenge;

    constructor(
        address challengeAddress,
        address chainlinkTokenAddress,
        address chainlinkOracleAddress,
        string memory chainlinkJobId
    ) {
        _challengeAddress = challengeAddress;
        setChainlinkToken(chainlinkTokenAddress);
        setChainlinkOracle(chainlinkOracleAddress);
        _jobId = bytes32(bytes(chainlinkJobId));
        _fee = (1 * LINK_DIVISIBILITY) / 10; // 0.1 * 10**18 (Varies by network and job)
    }

    function verifyChallengeCompletion(
        uint256 challengeTokenId,
        uint256 challengeDuration,
        string memory challengeHashtag,
        string memory challengeHandle,
        string memory participantHandle
    ) public {
        // Check sender
        if (msg.sender != _challengeAddress)
            revert Errors.NotChallengeContract();
        // Make chainlink request
        Chainlink.Request memory req = buildChainlinkRequest(
            _jobId,
            address(this),
            this.fulfill.selector
        );
        req.add(
            "get",
            string.concat(
                "https://web3challenges-app.vercel.app/api/verifier/twitter?challengeDuration=",
                Strings.toString(challengeDuration),
                "&challengeHashtag=",
                challengeHashtag,
                "&challengeHandle=",
                challengeHandle,
                "&participantHandle=",
                participantHandle
            )
        );
        req.add("path", "isVerified");
        bytes32 requestId = sendChainlinkRequest(req, _fee);
        // Save chainlink request
        _requestParams[requestId].challengeTokenId = challengeTokenId;
        _requestParams[requestId].participantHandle = participantHandle;
    }

    /**
     * Receive the response from chainlink.
     */
    function fulfill(
        bytes32 requestId,
        bool isVerified
    ) public recordChainlinkFulfillment(requestId) {
        if (isVerified) {
            _participantHandlesWithCompletedChallenge[
                _requestParams[requestId].challengeTokenId
            ][_requestParams[requestId].participantHandle] = true;
            emit ChallengeCompletionVerified(
                requestId,
                _requestParams[requestId].challengeTokenId,
                _requestParams[requestId].participantHandle
            );
        }
    }

    function isChallengeCompleted(
        uint256 challengeTokenId,
        string memory participantHandle
    ) public view returns (bool) {
        return
            _participantHandlesWithCompletedChallenge[challengeTokenId][
                participantHandle
            ];
    }
}
