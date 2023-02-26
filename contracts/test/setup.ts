import { Signer } from "ethers";
import { ethers } from "hardhat";
import { Profile, Profile__factory } from "../typechain-types";
import { revertToSnapshot, takeSnapshot } from "./helpers/utils";

export const profileUris = {
  one: "ipfs://abc",
  two: "ipfs://def",
};

export let accounts: Array<Signer>;
export let deployer: Signer;
export let userOne: Signer;
export let userTwo: Signer;
export let userThree: Signer;

export let deployerAddress: string;
export let userOneAddress: string;
export let userTwoAddress: string;
export let userThreeAddress: string;

export let profileContract: Profile;

export function makeSuiteCleanRoom(name: string, tests: () => void) {
  return describe(name, () => {
    beforeEach(async function () {
      await takeSnapshot();
    });
    tests();
    afterEach(async function () {
      await revertToSnapshot();
    });
  });
}

before(async function () {
  // Init accounts
  accounts = await ethers.getSigners();
  deployer = accounts[0];
  userOne = accounts[1];
  userTwo = accounts[2];
  userThree = accounts[3];

  // Init addresses
  deployerAddress = await deployer.getAddress();
  userOneAddress = await userOne.getAddress();
  userTwoAddress = await userTwo.getAddress();
  userThreeAddress = await userThree.getAddress();

  // Deploy challenge contract
  profileContract = await new Profile__factory(deployer).deploy();
  await profileContract.initialize();
});
