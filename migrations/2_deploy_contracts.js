const LendingData = artifacts.require("LendingData");
const GameItems721 = artifacts.require("GameItems721");
const FungibleTokens = artifacts.require("FungibleTokens");
const StakingTokens = artifacts.require("StakingTokens");
const DistributionTokens = artifacts.require("DistributionTokens");
const GameItems1155 = artifacts.require("GameItems1155");
//const Geyser = artifacts.require("Geyser");

// in order to increase the gas limit we need to rung ganache-cli --gasLimit max_gas_limit
module.exports = function(deployer, network) {
  deployer.deploy(GameItems721, {gas: 9000000});
  deployer.deploy(GameItems1155, "GAME-ITEMS-1155", {gas: 9000000});
  deployer.deploy(FungibleTokens, web3.utils.toHex("1000000000000000000"), "FungibleToken", "FT", {gas: 9000000});
  deployer.deploy(LendingData, {gas: 9000000});
  deployer.deploy(StakingTokens, web3.utils.toHex("1000000000000000000"), "StakingToken", "ST", {gas: 9000000});
  deployer.deploy(DistributionTokens, web3.utils.toHex("1000000000000000000"), "DistributionToken", "DT", {gas: 9000000});
  //deployer.deploy(Geyser, StakingTokens.address, DistributionTokens.address, 0, 10, 1000, 10000, 100, {gas: 9000000 });
};