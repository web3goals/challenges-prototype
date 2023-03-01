import { BigInt } from "@graphprotocol/graph-ts";
import { Challenge } from "../generated/schema";

export function loadOrCreateChallenge(tokenId: string): Challenge {
  let challengeId = tokenId;
  let challenge = Challenge.load(challengeId);
  if (!challenge) {
    challenge = new Challenge(challengeId);
    // Defaults for params
    challenge.createdTimestamp = BigInt.zero();
    challenge.creator = "";
    challenge.duration = BigInt.zero();
    challenge.hashtag = "";
    challenge.handle = "";
    challenge.description = "";
    challenge.prize = BigInt.zero();
    challenge.deadline = BigInt.zero();
    challenge.isFinalized = false;
    // Defaults for participants
    challenge.participantAddresses = new Array<string>();
    challenge.participantsNumber = 0;
  }
  return challenge;
}

export function getChallengeWithAddedParticipant(
  challenge: Challenge,
  participantAddress: string
): Challenge {
  // Check existing participant addresses
  for (let i = 0; i < challenge.participantAddresses.length; i++) {
    let address = challenge.participantAddresses[i];
    if (address == participantAddress) {
      return challenge;
    }
  }
  // Add participant address
  let newParticipantAddresses = challenge.participantAddresses;
  newParticipantAddresses.push(participantAddress);
  challenge.participantAddresses = newParticipantAddresses;
  challenge.participantsNumber = challenge.participantsNumber + 1;
  return challenge;
}
