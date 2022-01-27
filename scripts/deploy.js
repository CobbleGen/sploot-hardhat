// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const TestContract = await hre.ethers.getContractFactory("Sploot");
  const testContract = await TestContract.deploy('0x9e894db7b372cc0d34d4dbfb6bb1f5008be634e300c65913d2f2008adbcf94b8');

  await testContract.deployed();

  console.log("Test contract deployed to:", testContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });