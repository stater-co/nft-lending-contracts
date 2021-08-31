require("@nomiclabs/hardhat-waffle");

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
  solidity: "0.7.6",
  blockGasLimit: 90_000_000_000,
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_PROVIDER,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY]
    },
    ropsten: {
      url: process.env.ROPSTEN_PROVIDER,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY]
    },
    kovan: {
      url: process.env.KOVAN_PROVIDER,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY]
    },
    goerli: {
      url: process.env.GOERLI_PROVIDER,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY]
    },
    mainnet: {
      url: process.env.MAINNET_PROVIDER,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY]
    },
    matic: {
      url: process.env.MATIC_PROVIDER,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY]
    },
    polygon: {
      url: process.env.POLYGON_PROVIDER,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY]
    },
    bsc: {
      url: process.env.BSC_PROVIDER,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY]
    },
    hardhat: {

      /**
       * @DIIMIIM: This will set the block gas limit with 90kkk
       * Available on local network only
       */
      blockGasLimit: 90_000_000_000
    }
  },
  mocha: {
    /**
     * @DIIMIIM: Required to surpass the default promise timeout (20k)
     */
    timeout: 100000
  }
};
