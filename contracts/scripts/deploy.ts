import hre, { ethers } from "hardhat";
import { Profile__factory } from "../typechain-types";
import { deployedContracts } from "./helpers/constants";

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

  // Deploy profile contract
  if (!chainContracts.profile) {
    console.log(`\n👟 Start deploy profile contract`);
    const contract = await new Profile__factory(deployerWallet).deploy();
    await contract.deployed();
    await contract.initialize();
    console.log("✅ Contract deployed to " + contract.address);
    chainContracts.profile = contract.address;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
