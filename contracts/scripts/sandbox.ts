import { ethers } from "hardhat";
import { Challenge__factory } from "../typechain-types";

async function main() {
  // Init account
  const accountWallet = new ethers.Wallet(
    process.env.PRIVATE_KEY_1 || "",
    ethers.provider
  );

  // Execute transaction
  const transaction = await Challenge__factory.connect(
    "0xD9fEAbe16BAb684B5537eb6cbB43C8A4e6a90F47",
    accountWallet
  ).isChallengeCompleted("1");
  console.log("Transaction result:", transaction);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
