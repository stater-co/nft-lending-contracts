// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("ethers");
const hre = require("hardhat");

/** 
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@nomiclabs/hardhat-waffle');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Discounts = await hre.ethers.getContractFactory("StaterDiscounts");
  const NFT721 = await hre.ethers.getContractFactory("GameItems721");
  const NFT1155 = await hre.ethers.getContractFactory("GameItems1155");
  const StakingTokens = await hre.ethers.getContractFactory("StakingTokens");
  const DistributionTokens = await hre.ethers.getContractFactory("DistributionTokens");
  const discounts = await Discounts.deploy();
  const nft721 = await NFT721.deploy();
  const nft1155 = await NFT1155.deploy();
  const stakingTokens = await StakingTokens.deploy(BigNumber.from('1000000000000000000'),"Test Staking Tokens", "TST");
  const distributionTokens = await DistributionTokens.deploy(BigNumber.from('1000000000000000000'),"Test Distribution Tokens", "TDT");
  
  await discounts.deployed();
  await nft721.deployed();
  await nft1155.deployed();
  await stakingTokens.deployed();
  await distributionTokens.deployed();
  
  const TokenGeyser = await hre.ethers.getContractFactory("TokenGeyser");
  const tokenGeyser = await TokenGeyser.deploy(stakingTokens.address,distributionTokens.address,10000,100,1000,100);
  await tokenGeyser.deployed();

  console.log("Discounts deployed to:", discounts.address);
  console.log("NFT721 deployed to:", nft721.address);
  console.log("NFT1155 deployed to:", nft1155.address);
  console.log("Staking tokens deployed to:", stakingTokens.address);
  console.log("Distribution tokens deployed to:", distributionTokens.address);
  console.log("Token geyser deployed to:", distributionTokens.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
