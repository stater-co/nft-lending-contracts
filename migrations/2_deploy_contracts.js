const LendingData = artifacts.require("LendingData");
const GameItems721 = artifacts.require("GameItems721");
const FungibleTokens = artifacts.require("FungibleTokens");
const StakingTokens = artifacts.require("StakingTokens");
const DistributionTokens = artifacts.require("DistributionTokens");
const GameItems1155 = artifacts.require("GameItems1155");
const Geyser = artifacts.require("Geyser");

// in order to increase the gas limit we need to run ganache-cli --gasLimit max_gas_limit
// > ganache-cli --port=8545 --gasLimit 90000000
module.exports = async function(deployer) {

  const gameItems1155 = await deployer.deploy(GameItems1155, "GAME-ITEMS-1155", {gas: 90000000});

  await deployer.deploy(GameItems721, {gas: 90000000});
  
  await deployer.deploy(FungibleTokens, web3.utils.toHex("1000000000000000000"), "FungibleToken", "FT", {gas: 90000000});

  const stakingTokens = await deployer.deploy(StakingTokens, web3.utils.toHex("1000000000000000000"), "StakingToken", "ST", {gas: 90000000});

  console.log("ok 1");
  const distributionTokens = await deployer.deploy(DistributionTokens, web3.utils.toHex("1000000000000000000"), "DistributionToken", "DT", {gas: 90000000});

  console.log("ok 2");
  const geyser = await deployer.deploy(Geyser, stakingTokens.address, distributionTokens.address, 0, 10, 1000, 10000, 100, {gas: 90000000 });

  await deployer.deploy(LendingData, gameItems1155.address, [geyser.address], [1,2], {gas: 90000000});

};