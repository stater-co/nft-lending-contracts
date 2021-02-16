const GameItems721 = artifacts.require("GameItems721");
const FungibleTokens = artifacts.require("FungibleTokens");
const StakingTokens = artifacts.require("StakingTokens");
const DistributionTokens = artifacts.require("DistributionTokens");
const GameItems1155 = artifacts.require("GameItems1155");
const Geyser = artifacts.require("Geyser");
const LendingData = artifacts.require("LendingData");

// in order to increase the gas limit we need to run ganache-cli --gasLimit max_gas_limit
// > ganache-cli --port=8545 --gasLimit 90000000
module.exports = async (deployer) => {

  await deployer.deploy(GameItems721);
  
  await deployer.deploy(FungibleTokens, web3.utils.toHex("1000000000000000000"), "FungibleToken", "FT");

  /*
  deployer.deploy(GameItems1155, "GAME-ITEMS-1155", {gas: 6000000}).then(function() {
    deployer.deploy(StakingTokens, web3.utils.toHex("1000000000000000000"), "StakingToken", "ST", {gas: 6000000}).then(function() {
      deployer.deploy(DistributionTokens, web3.utils.toHex("1000000000000000000"), "DistributionToken", "DT", {gas: 6000000}).then(function() {
        deployer.deploy(Geyser, StakingTokens.address, DistributionTokens.address, 0, 10, 1000, 10000, 100, {gas: 6000000 }).then(function() {
          deployer.deploy(LendingData, GameItems1155.address, [Geyser.address], [1,2], {gas: 6000000}).then(function() {
            return true;
          })
        })
      })
    });
  });
  */

  /*
  deployer.deploy(GameItems1155, "GAME-ITEMS-1155");
  deployer.deploy(StakingTokens, web3.utils.toHex("1000000000000000000"), "StakingToken", "ST");
  deployer.deploy(DistributionTokens, web3.utils.toHex("1000000000000000000"), "DistributionToken", "DT");
  
  // For some reason the geyser contract is not deployed...
  //deployer.deploy(Geyser, StakingTokens.address, DistributionTokens.address, 0, 10, 1000, 10000, 100);
  //deployer.deploy(LendingData, GameItems1155.address, [GameItems1155.address], [1,2]);
  */

 await deployer.deploy(GameItems1155, "GAME-ITEMS-1155");
 await deployer.deploy(StakingTokens, web3.utils.toHex("1000000000000000000"), "StakingToken", "ST");
 await deployer.deploy(DistributionTokens, web3.utils.toHex("1000000000000000000"), "DistributionToken", "DT");
 //await deployer.deploy(Geyser, StakingTokens.address, DistributionTokens.address, 0, 10, 1000, 10000, 100);
 await deployer.deploy(LendingData, GameItems1155.address, [GameItems1155.address], [1,2]);

};