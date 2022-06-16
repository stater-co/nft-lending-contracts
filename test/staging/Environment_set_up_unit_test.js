const { assert, expect } = require("chai")
const { network, ethers, run } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")


developmentChains.includes(network.name)
  ? describe.skip
  : describe("Environment set-up", async function () {

      beforeEach(async () => {

      })

      afterEach(async function () {

      })

      // We can't use an arrow functions here because we need to use `this`. So we need
      // to use `async function() {` as seen.
      it("Our event should successfully fire on callback", async function () {

      })
    })
