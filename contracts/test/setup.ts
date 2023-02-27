import { BigNumber, Signer } from "ethers";
import { ethers } from "hardhat";
import {
  Challenge,
  Challenge__factory,
  MockVerifier,
  MockVerifier__factory,
  Profile,
  Profile__factory,
} from "../typechain-types";
import { SECONDS_PER_DAY } from "./helpers/constants";
import {
  getEpochSeconds,
  revertToSnapshot,
  takeSnapshot,
} from "./helpers/utils";

export const profileUris = {
  one: "ipfs://abc",
  two: "ipfs://def",
};

export const userHandles = {
  one: "userOne",
  two: "userTwo",
  three: "userThree",
  four: "userFour",
};

export const challengeParams = {
  one: {
    duration: 30,
    hashtag: "#30DaysOfCode",
    handle: "BestDevsDAO",
    description:
      "Participate in the #30DaysOfCode challenge and win prizes from BestDevsDAO",
    prize: BigNumber.from("50000000000000000"),
    deadline: BigNumber.from(getEpochSeconds() + 2 * SECONDS_PER_DAY),
  },
};

export let accounts: Array<Signer>;
export let deployer: Signer;
export let userOne: Signer;
export let userTwo: Signer;
export let userThree: Signer;
export let userFour: Signer;

export let deployerAddress: string;
export let userOneAddress: string;
export let userTwoAddress: string;
export let userThreeAddress: string;
export let userFourAddress: string;

export let profileContract: Profile;
export let challengeContract: Challenge;
export let verifierContract: MockVerifier;

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
  userFour = accounts[4];

  // Init addresses
  deployerAddress = await deployer.getAddress();
  userOneAddress = await userOne.getAddress();
  userTwoAddress = await userTwo.getAddress();
  userThreeAddress = await userThree.getAddress();
  userFourAddress = await userFour.getAddress();

  // Deploy profile contract
  profileContract = await new Profile__factory(deployer).deploy();
  await profileContract.initialize();

  // Deploy verify contract
  verifierContract = await new MockVerifier__factory(deployer).deploy();

  // Deploy challenge contract
  challengeContract = await new Challenge__factory(deployer).deploy();
  await challengeContract.initialize(verifierContract.address);
});
