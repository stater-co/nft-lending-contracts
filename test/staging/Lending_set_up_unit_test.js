const { assert } = require("chai")
const { network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
  ? describe.skip
  : describe("RandomNumberConsumer Staging Tests", async function () {

      beforeEach(async () => {

      })

      afterEach(async function () {

      })

      // We can't use an arrow functions here because we need to use `this`. So we need
      // to use `async function() {` as seen.
      it("Our event should successfully fire event on callback", async function () {

      })
    })
