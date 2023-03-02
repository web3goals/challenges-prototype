// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

library DataTypes {
    struct ChallengeParams {
        uint256 createdTimestamp;
        address creator;
        uint256 duration;
        string hashtag;
        string handle;
        string description;
        uint256 prize;
        uint256 deadline;
        bool isFinalized;
        uint256 finalizedTimestamp;
        uint256 winnersNumber;
    }

    struct ChallengeParticipant {
        uint256 addedTimestamp;
        address accountAddress;
        string handle;
        bool isChallengeCompleted;
        bool isPrizeReceived;
    }
}
