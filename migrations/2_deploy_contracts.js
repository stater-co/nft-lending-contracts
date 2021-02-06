const LendingData = artifacts.require("LendingData");
const GameItems721 = artifacts.require("GameItems721");
const FungibleTokens = artifacts.require("FungibleTokens");
const StakingToken = artifacts.require("FungibleTokens");
const DistributionToken = artifacts.require("FungibleTokens");
const GameItems1155 = artifacts.require("GameItems1155");

module.exports = function(deployer, network) {
	
  // OpenSea proxy registry addresses for rinkeby and mainnet.
  let proxyRegistryAddress;
  
  if (network === 'rinkeby') {
    proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
  } else {
    proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
  }

  deployer.deploy(GameItems721, {gas: 9000000});
  deployer.deploy(GameItems1155, "GAME-ITEMS-1155", {gas: 9000000});
  deployer.deploy(FungibleTokens, web3.utils.toHex("1000000000000000000"), "FungibleToken", "FT", {gas: 9000000});
  deployer.deploy(StakingToken, web3.utils.toHex("1000000000000000000"), "FungibleToken", "FT", {gas: 9000000});
  deployer.deploy(DistributionToken, web3.utils.toHex("1000000000000000000"), "FungibleToken", "FT", {gas: 9000000});
  deployer.deploy(LendingData, {gas: 9000000});
};