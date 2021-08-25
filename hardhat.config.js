require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

//export ACCOUNT_ADDRESS=0xB29A60829E73C88f0A289c9260981245Bca2eAa4
//export ACCOUNT_PRIVATE_KEY=0x7a93e9dc08ed1eaea7278e5428c7ba2724f12535f4cd3cc9838951b9a31edfd0

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.6",
  networks: {
    rinkeby: {
      url: process.env.URL,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY]
    },
    ropsten: {
      url: process.env.URL,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY]
    },
    kovan: {
      url: process.env.URL,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY]
    },
    goerli: {
      url: process.env.URL,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY]
    },
    mainnet: {
      url: process.env.URL,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY]
    },
    matic: {
      url: process.env.URL,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY]
    },
    polygon: {
      url: process.env.URL,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY]
    },
    bsc: {
      url: process.env.URL,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY]
    }
  }
};