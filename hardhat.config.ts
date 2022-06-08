import "@nomiclabs/hardhat-waffle";



/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.14",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
        }
      }
    ]
  },
  blockGasLimit: 90_000_000_000,
  settings: {
    optimizer: {
      enabled: true,
      runs: 1,
    },
  },
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
