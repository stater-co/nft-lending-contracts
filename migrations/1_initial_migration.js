const Migrations = artifacts.require("Migrations");

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(Migrations);
};