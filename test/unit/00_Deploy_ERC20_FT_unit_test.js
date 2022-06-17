const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat")


describe("Deploy ERC20 Contract", async function () {
  let Contract, contract;

  beforeEach(async () => {
    Contract = await ethers.getContractFactory("FungibleTokens");
  })

  describe("Deployment", () => {
    it("Status", async () => {
      contract = await Contract.deploy(
        BigNumber.from("1000000000000000000"),
        "Test ERC20",
        "TERC20"
      );
      await contract.deployed();
      expect(contract.address).to.have.lengthOf(42);
    })
  })
});
