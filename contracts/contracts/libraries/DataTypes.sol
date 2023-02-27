// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

library DataTypes {
    struct ChallengeParams {
        uint createdTimestamp;
        address creator;
        uint256 duration;
        string hashtag;
        string handle;
        string description;
        uint256 prize;
        uint256 deadline;
        bool isFinalized;
    }

    struct ChallengeParticipant {
        uint addedTimestamp;
        address accountAddress;
        string handle;
        bool isChallengeCompleted;
        bool isPrizeReceived;
    }
}
