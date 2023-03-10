import { time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { SECONDS_PER_DAY } from "../helpers/constants";
import {
  challengeContract,
  challengeParams,
  makeSuiteCleanRoom,
  userFour,
  userFourAddress,
  userHandles,
  userOne,
  userOneAddress,
  userThree,
  userThreeAddress,
  userTwo,
  userTwoAddress,
} from "../setup";

makeSuiteCleanRoom("Challenge", function () {
  it("User should be able to start and finalize a challenge, other users should be able to participate and verify completion", async function () {
    // Start a challenge by user one
    const tx = challengeContract
      .connect(userOne)
      .start(
        challengeParams.one.duration,
        challengeParams.one.hashtag,
        challengeParams.one.handle,
        challengeParams.one.description,
        challengeParams.one.prize,
        challengeParams.one.deadline,
        {
          value: challengeParams.one.prize,
        }
      );
    await expect(tx).to.be.not.reverted;
    await expect(tx).to.changeEtherBalances(
      [userOne, challengeContract.address],
      [
        challengeParams.one.prize.mul(ethers.constants.NegativeOne),
        challengeParams.one.prize,
      ]
    );
    // Get started challenge id
    const startedChallengeId = await challengeContract
      .connect(userOne)
      .getCurrentCounter();
    // Check challenge params
    let params = await challengeContract.getParams(startedChallengeId);
    expect(params.creator).to.equal(userOneAddress);
    expect(params.prize).to.equal(challengeParams.one.prize);
    // Participate by user two, three, four
    await expect(
      challengeContract
        .connect(userTwo)
        .participate(startedChallengeId, userHandles.two)
    ).to.be.not.reverted;
    await expect(
      challengeContract
        .connect(userThree)
        .participate(startedChallengeId, userHandles.three)
    ).to.be.not.reverted;
    await expect(
      challengeContract
        .connect(userFour)
        .participate(startedChallengeId, userHandles.four)
    ).to.be.not.reverted;
    let participants = await challengeContract.getParticipants(
      startedChallengeId
    );
    // Check participants
    expect(participants.length).to.be.equal(3);
    // Verify completion by user two, four
    await expect(
      challengeContract.connect(userTwo).verify(startedChallengeId)
    ).to.be.not.reverted;
    await expect(
      challengeContract.connect(userFour).verify(startedChallengeId)
    ).to.be.not.reverted;
    // Check verification status
    const isUserTwoCompletedChallenge = await challengeContract
      .connect(userTwo)
      .isChallengeCompleted(startedChallengeId);
    const isUserThreeCompletedChallenge = await challengeContract
      .connect(userThree)
      .isChallengeCompleted(startedChallengeId);
    const isUserFourCompletedChallenge = await challengeContract
      .connect(userFour)
      .isChallengeCompleted(startedChallengeId);
    expect(isUserTwoCompletedChallenge).to.equal(true);
    expect(isUserThreeCompletedChallenge).to.equal(false);
    expect(isUserFourCompletedChallenge).to.equal(true);
    // Complete challenge by user two, four
    await expect(
      challengeContract.connect(userTwo).complete(startedChallengeId)
    ).to.be.not.reverted;
    await expect(
      challengeContract.connect(userThree).complete(startedChallengeId)
    ).to.be.reverted;
    await expect(
      challengeContract.connect(userFour).complete(startedChallengeId)
    ).to.be.not.reverted;
    participants = await challengeContract.getParticipants(startedChallengeId);
    for (const participant of participants) {
      if (participant.accountAddress == userTwoAddress) {
        expect(participant.isChallengeCompleted).to.equal(true);
      }
      if (participant.accountAddress == userThreeAddress) {
        expect(participant.isChallengeCompleted).to.equal(false);
      }
      if (participant.accountAddress == userFourAddress) {
        expect(participant.isChallengeCompleted).to.equal(true);
      }
    }
    // Increase network time
    await time.increase(3 * SECONDS_PER_DAY);
    // Finalize challenge by user one
    await expect(
      challengeContract.connect(userOne).finalize(startedChallengeId)
    ).to.changeEtherBalances(
      [userTwo, userFour, challengeContract],
      [
        challengeParams.one.prize.div(BigNumber.from(2)),
        challengeParams.one.prize.div(BigNumber.from(2)),
        challengeParams.one.prize.mul(ethers.constants.NegativeOne),
      ]
    );
    // Check challenge params
    params = await challengeContract.getParams(startedChallengeId);
    expect(params.isFinalized).to.equal(true);
  });
});
