require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "localhost",
  networks: {
    ropsten: {
      url: "https://ropsten.infura.io/v3/60a2636c7c094ce2a93c984ce4c0b20f",
      accounts: ["7b324e4b1ad72d786490c4fb7ce1ea87d867841968359441c59c8c40c05d03c4"]
    }
  },
  etherscan: {
    apiKey: "MN9AJD4QGI4STER63P7ESFEEWMDG9IR9TV"
}
};
