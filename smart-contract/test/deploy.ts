// scripts/deploy.js

import { ethers } from "hardhat";

async function main() {
  // Get the contract factory
  const GuessTheNumber = await ethers.getContractFactory("GuessTheNumber");
  
  // Deploy the contract (no constructor parameters needed)
  const tx = await GuessTheNumber.deploy();

  // Wait for the deployment to finish
  const  guessTheNumber = await tx.waitForDeployment();

  console.log("GuessTheNumber contract deployed to:", guessTheNumber.target);
}

// Main deployment function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
