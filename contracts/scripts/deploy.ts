import hre, { ethers } from "hardhat";
import {
  Challenge__factory,
  Profile__factory,
  Verifier__factory,
} from "../typechain-types";
import { contractsData, deployedContracts } from "./helpers/constants";

async function main() {
  // Define chain
  const chain = hre.hardhatArguments.network;
  if (!chain) {
    console.log("\n❌ Chain is not defined");
    return;
  }
  console.log(`\n🌎 Running on chain '${chain}'`);

  // Define deployer wallet
  const deployerWallet = new ethers.Wallet(
    process.env.PRIVATE_KEY_1 || "",
    ethers.provider
  );

  // Define chain data
  const chainContracts = deployedContracts[chain];
  const chainContractData = contractsData[chain];

  // Deploy profile contract
  if (!chainContracts.profile) {
    console.log(`\n👟 Start deploy profile contract`);
    const contract = await new Profile__factory(deployerWallet).deploy();
    await contract.deployed();
    await contract.initialize();
    console.log("✅ Contract deployed to: " + contract.address);
    console.log(
      "👉 Command for vefifying: " +
        `npx hardhat verify --network ${chain} ${contract.address}`
    );
    chainContracts.profile = contract.address;
  }

  // Deploy challenge contract
  if (!chainContracts.challenge) {
    console.log(`\n👟 Start deploy challenge contract`);
    const contract = await new Challenge__factory(deployerWallet).deploy();
    await contract.deployed();
    await contract.initialize(
      chainContracts.verifier || ethers.constants.AddressZero
    );
    console.log("✅ Contract deployed to: " + contract.address);
    console.log(
      "👉 Command for vefifying: " +
        `npx hardhat verify --network ${chain} ${contract.address}`
    );
    chainContracts.challenge = contract.address;
  }

  // Deploy verifier contract
  if (!chainContracts.verifier) {
    console.log(`\n👟 Start deploy verifier contract`);
    const contract = await new Verifier__factory(deployerWallet).deploy(
      chainContracts.challenge,
      chainContractData.verifierContract.chainlinkTokenAddress,
      chainContractData.verifierContract.chainlinkOracleAddress,
      chainContractData.verifierContract.chainlinkJobId
    );
    await contract.deployed();
    console.log("✅ Contract deployed to " + contract.address);
    console.log(
      "👉 Command for vefifying: " +
        `npx hardhat verify --network ${chain} ${contract.address} ${chainContracts.challenge} ${chainContractData.verifierContract.chainlinkTokenAddress} ${chainContractData.verifierContract.chainlinkOracleAddress} ${chainContractData.verifierContract.chainlinkJobId}`
    );
    chainContracts.verifier = contract.address;
    console.log("⚡ Send contract address to challenge");
    await Challenge__factory.connect(
      chainContracts.challenge,
      deployerWallet
    ).setVerifierAddress(contract.address);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
