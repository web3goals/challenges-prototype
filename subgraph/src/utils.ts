import { BigInt } from "@graphprotocol/graph-ts";
import { Challenge } from "../generated/schema";

export function loadOrCreateChallenge(tokenId: string): Challenge {
  let challengeId = tokenId;
  let challenge = Challenge.load(challengeId);
  if (!challenge) {
    challenge = new Challenge(challengeId);
    challenge.createdTimestamp = BigInt.zero();
    challenge.creator = "";
    challenge.duration = BigInt.zero();
    challenge.hashtag = "";
    challenge.handle = "";
    challenge.description = "";
    challenge.prize = BigInt.zero();
    challenge.deadline = BigInt.zero();
    challenge.isFinalized = false;
  }
  return challenge;
}
