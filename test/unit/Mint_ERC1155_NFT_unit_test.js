const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Mint ERC1155 NFT", async function () {
      beforeEach(async () => {

      })

      it("", async () => {

      })

      it("", async () => {

      })

      it("", async () => {

      })
    })
