const LendingData = artifacts.require("LendingData");
const LendingLogic = artifacts.require("LendingLogic");
const GameItems = artifacts.require("GameItems");

module.exports = function(deployer, network) {
	
  // OpenSea proxy registry addresses for rinkeby and mainnet.
  let proxyRegistryAddress;
  
  if (network === 'rinkeby') {
    proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
  } else {
    proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
  }

  deployer.deploy(LendingData, {gas: 6000000});
  deployer.deploy(LendingLogic, {gas: 3000000});
  deployer.deploy(GameItems, {gas: 6000000});
};