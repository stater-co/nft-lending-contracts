const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Mint ERC20 FT", async function () {

      beforeEach(async () => {

      })

      describe("", () => {
        it("", async () => {

        })
      })

      describe("", () => {
        it("", async () => {

        })
      })
    })
