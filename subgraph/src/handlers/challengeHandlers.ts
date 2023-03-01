import { ParamsSet, Transfer } from "../../generated/Challenge/Challenge";
import { Challenge } from "../../generated/schema";
import { loadOrCreateChallenge } from "../utils";

export function handleTransfer(event: Transfer): void {
  let challenge = loadOrCreateChallenge(event.params.tokenId.toString());
  challenge.save();
}

export function handleParamsSet(event: ParamsSet): void {
  // Load challenge
  let challenge = Challenge.load(event.params.tokenId.toString());
  if (!challenge) {
    return;
  }
  // Update challege
  challenge.createdTimestamp = event.params.params.createdTimestamp;
  challenge.creator = event.params.params.creator.toHexString();
  challenge.duration = event.params.params.duration;
  challenge.hashtag = event.params.params.hashtag;
  challenge.handle = event.params.params.handle;
  challenge.description = event.params.params.description;
  challenge.prize = event.params.params.prize;
  challenge.deadline = event.params.params.deadline;
  challenge.isFinalized = event.params.params.isFinalized;
  challenge.save();
}
