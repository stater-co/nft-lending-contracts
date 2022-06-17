const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Deploy Loan Methods Contract", async function () {
  let Contract, contract;

  beforeEach(async () => {
    Contract = await ethers.getContractFactory("LendingMethods");
  })

  describe("Deployment", () => {
    it("Status", async () => {
      contract = await Contract.deploy(
        "Loans NFT",
        "LNFT"
      );
      await contract.deployed();
      expect(contract.address).to.have.lengthOf(42);
    })
  })
  
});