import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import {
  profileContract,
  profileUris,
  makeSuiteCleanRoom,
  userOne,
  userOneAddress,
  userThreeAddress,
  userTwo,
  userTwoAddress,
} from "../setup";

makeSuiteCleanRoom("Profile", function () {
  it("User should to own only one token after several uri changes", async function () {
    // Before changes
    expect(await profileContract.balanceOf(userOneAddress)).to.equal(
      ethers.constants.Zero
    );
    expect(await profileContract.getURI(userOneAddress)).to.equal("");
    // First change
    await expect(
      profileContract.connect(userOne).setURI(profileUris.one)
    ).to.be.not.reverted;
    expect(await profileContract.balanceOf(userOneAddress)).to.equal(
      BigNumber.from(1)
    );
    expect(await profileContract.getURI(userOneAddress)).to.equal(
      profileUris.one
    );
    // Second change
    await expect(
      profileContract.connect(userOne).setURI(profileUris.two)
    ).to.be.not.reverted;
    expect(await profileContract.balanceOf(userOneAddress)).to.equal(
      BigNumber.from(1)
    );
    expect(await profileContract.getURI(userOneAddress)).to.equal(
      profileUris.two
    );
  });

  it("User should fail to transfer token", async function () {
    // Set uri
    await expect(
      profileContract.connect(userTwo).setURI(profileUris.one)
    ).to.be.not.reverted;
    // Get token id
    const tokenId = await profileContract.getTokenId(userTwoAddress);
    // Transfer
    await expect(
      profileContract
        .connect(userTwo)
        .transferFrom(userTwoAddress, userThreeAddress, tokenId)
    ).to.be.reverted;
  });
});
