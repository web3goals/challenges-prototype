// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

interface IVerifier {
    function verifyChallengeCompletion(
        uint256 challengeTokenId,
        uint256 challengeDuration,
        string memory challengeHashtag,
        string memory challengeHandle,
        string memory participantHandle
    ) external;

    function isChallengeCompleted(
        uint256 challengeTokenId,
        string memory participantHandle
    ) external view returns (bool);
}
