// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "../interfaces/IVerifier.sol";

contract MockVerifier is IVerifier {
    mapping(uint256 => mapping(string => bool))
        internal _handlesWithCompletedChallenge;

    function verifyChallengeCompletion(
        uint256 challengeTokenId,
        uint256 challengeDuration,
        string memory challengeHashtag,
        string memory challengeHandle,
        string memory participantHandle
    ) public {
        _handlesWithCompletedChallenge[challengeTokenId][
            participantHandle
        ] = true;
    }

    function isChallengeCompleted(
        uint256 challengeTokenId,
        string memory participantHandle
    ) public view returns (bool) {
        return
            _handlesWithCompletedChallenge[challengeTokenId][participantHandle];
    }
}
