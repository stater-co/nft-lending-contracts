const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Deploy ERC1155 Contract", async function () {
  let Contract, contract;

  beforeEach(async () => {
    Contract = await ethers.getContractFactory("GameItems1155");
  })

  describe("Deployment", () => {
    it("Status", async () => {
      contract = await Contract.deploy(
        "Test ERC1155"
      );
      await contract.deployed();
      expect(contract.address).to.have.lengthOf(42);
    })
  })
  
})
