const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Deploy ERC721 Contract", async function () {
  let Contract, contract;

  beforeEach(async () => {
    Contract = await ethers.getContractFactory("GameItems721");
  })

  describe("Deployment", () => {
    it("Status", async () => {
      contract = await Contract.deploy(
        "Test ERC721",
        "TERC721"
      );
      await contract.deployed();
      expect(contract.address).to.have.lengthOf(42);
    })
  })
  
})
