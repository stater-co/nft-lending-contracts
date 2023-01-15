import '@nomiclabs/hardhat-etherscan';
import '@typechain/hardhat';
import '@nomicfoundation/hardhat-chai-matchers';
import 'hardhat-gas-reporter'
import '@nomiclabs/hardhat-ethers';
import 'solidity-coverage';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-deploy-ethers'
import { HardhatUserConfig } from 'hardhat/config';


const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0
    },
    mainnet: {
      url: String(process.env.MAINNET_PROVIDER),
      accounts: [String(process.env.ACCOUNT_PRIVATE_KEY)]
    },
    polygonMainnet: {
      url: String(process.env.POLYGON_PROVIDER),
      accounts: [String(process.env.ACCOUNT_PRIVATE_KEY)]
    },
    bsc: {
      url: String(process.env.BSC_PROVIDER),
      accounts: [String(process.env.ACCOUNT_PRIVATE_KEY)]
    },
  },
  etherscan: {
    apiKey: process.env.POLYSCAN_API_KEY
  },
  solidity: {
    compilers: [
      {
        version: '0.7.6'
      }
    ]
  },
  paths: {
    sources: './contracts',
    artifacts: './artifacts',
    root: './',
    tests: './test',
    cache: './cache'
  },
  gasReporter: {
    currency: 'ETH',
    gasPrice: 40,
    enabled: true
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    timeout: 100000000,
    reporterOptions : {

    }
  }
};

export default config;