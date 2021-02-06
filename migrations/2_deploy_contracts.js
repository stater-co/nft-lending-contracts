const LendingData = artifacts.require("LendingData");
const GameItems721 = artifacts.require("GameItems721");
const FungibleTokens = artifacts.require("FungibleTokens");
const GameItems1155 = artifacts.require("GameItems1155");

module.exports = function(deployer, network) {

  deployer.deploy(GameItems721, {gas: 6000000});
  deployer.deploy(GameItems1155, "GAME-ITEMS-1155", {gas: 6000000});
  deployer.deploy(FungibleTokens, web3.utils.toHex("1000000000000000000"), "FungibleToken", "FT", {gas: 6000000});
  deployer.deploy(LendingData, {gas: 6000000});
};