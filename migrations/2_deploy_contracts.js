const GameItems721 = artifacts.require("GameItems721");
const FungibleTokens = artifacts.require("FungibleTokens");
const StakingTokens = artifacts.require("StakingTokens");
const DistributionTokens = artifacts.require("DistributionTokens");
const GameItems1155 = artifacts.require("GameItems1155");
const TokenGeyser = artifacts.require("TokenGeyser");
const LendingData = artifacts.require("LendingData");

// in order to increase the gas limit we need to run ganache-cli --gasLimit max_gas_limit
// > ganache-cli --port=8545 --gasLimit 90000000
/* or */
// > truffle develop
// > test
module.exports = (deployer) => {
  deployer.deploy(GameItems721, { gas : 6000000 });
  deployer.deploy(FungibleTokens, web3.utils.toHex("1000000000000000000"), "FungibleToken", "FT", { gas : 6000000 });
  deployer.deploy(GameItems1155, "GAME-ITEMS-1155", { gas : 6000000 });
  deployer.deploy(StakingTokens, web3.utils.toHex("1000000000000000000"), "StakingToken", "ST", { gas : 6000000 });
  deployer.deploy(DistributionTokens, web3.utils.toHex("1000000000000000000"), "DistributionToken", "DT", { gas : 6000000 });
  deployer.deploy(TokenGeyser, StakingTokens.address, DistributionTokens.address, 0, 10, 1000, 10000, { gas : 6000000 });
  deployer.deploy(LendingData, GameItems1155.address, [], [0,1], { gas : 6000000 });
};