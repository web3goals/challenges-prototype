import {
  challengeContract,
  challengeParams,
  makeSuiteCleanRoom,
  userFour,
  userHandles,
  userOne,
  userOneAddress,
  userThree,
  userTwo,
} from "../setup";
import { expect } from "chai";
import { ethers } from "hardhat";

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
    const params = await challengeContract.getParams(startedChallengeId);
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
    const participants = await challengeContract.getParticipants(
      startedChallengeId
    );
    expect(participants.length).to.be.equal(3);
    // Check participants
    // Verify completion by user two, four
    // TODO:
    // Finalize challenge by user one
    // TODO:
  });
});
