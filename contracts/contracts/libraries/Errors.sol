// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

library Errors {
    // Common errors
    error TokenNotTransferable();
    error TokenDoesNotExist();

    // Challenge errors
    error MessageValueMismatch();
    error PrizeInvalid();
    error VerifierNotFound();
    error ChallengeFinalized();
    error AlreadyParticipant();
    error NotParticipant();

    // Verifier errors
    error NotChallengeContract();
}
