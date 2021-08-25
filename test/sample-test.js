const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");


let discounts, erc721, erc1155, tokenGeyser, stakingTokens, distributionTokens;
const nrOfERC721Tokens = 100, nrOfERC1155Tokens = 100, quantityOfERC1155Tokens = 1000;


describe("Smart Contracts Setup", function () {

  it("Should deploy the discounts contract on local testnet", async function () {
    const Discounts = await ethers.getContractFactory("StaterDiscounts");
    const _discounts = await Discounts.deploy();
    await _discounts.deployed();
    expect(_discounts.address).to.have.lengthOf(42);
    discounts = _discounts;
  });

  it("Should deploy the ERC721 contract on local testnet", async function () {
    const NFT721 = await ethers.getContractFactory("GameItems721");
    const _nft721 = await NFT721.deploy();
    await _nft721.deployed();
    expect(_nft721.address).to.have.lengthOf(42);
    erc721 = _nft721;
  });

  it("Should deploy the ERC1155 contract on local testnet", async function () {
    const NFT1155 = await ethers.getContractFactory("GameItems1155");
    const _nft1155 = await NFT1155.deploy();
    await _nft1155.deployed();
    expect(_nft1155.address).to.have.lengthOf(42);
    erc1155 = _nft1155;
  });

  it("Should deploy the token geyser contract on local testnet", async function () {

    const StakingTokens = await ethers.getContractFactory("StakingTokens");
    const _stakingTokens = await StakingTokens.deploy(BigNumber.from('1000000000000000000'),"Test Staking Tokens", "TST");
    await _stakingTokens.deployed();
    expect(_stakingTokens.address).to.have.lengthOf(42);
    stakingTokens = _stakingTokens;

    const Distributiontokens = await ethers.getContractFactory("DistributionTokens");
    const _distributionTokens = await Distributiontokens.deploy(BigNumber.from('1000000000000000000'),"Test Distribution Tokens", "TDT");
    await _distributionTokens.deployed();
    expect(_distributionTokens.address).to.have.lengthOf(42);
    distributionTokens = _distributionTokens;

    const TokenGeyser = await ethers.getContractFactory("TokenGeyser");
    const _tokenGeyser = await TokenGeyser.deploy(_stakingTokens.address,_distributionTokens.address,10000,100,1000,100);
    await _tokenGeyser.deployed();
    expect(_tokenGeyser.address).to.have.lengthOf(42);
    tokenGeyser = _tokenGeyser;

  });

});


describe("Preparations", function () {

  it("Create " + nrOfERC721Tokens + " ERC721 tokens", async function () {
    for ( let i = 0 ; i < nrOfERC721Tokens ; ++i ) {
      let operation = await erc721.createItem("Token 1", "Token 1 description", "Token 1 URL");
      expect(operation.hash).to.have.lengthOf(66);
    }
  });

  it("Verify ERC721 tokens ownership", async function () {
    const [deployer] = await ethers.getSigners();
    let operation = await erc721.balanceOf(deployer.address);
    expect(BigNumber.from(nrOfERC721Tokens) === operation.hex);
  });

  it("Create " + nrOfERC1155Tokens + " ERC1155 tokens", async function () {
    const [deployer] = await ethers.getSigners();
    for ( let i = 0 ; i < nrOfERC1155Tokens ; ++i ) {
      let operation = await erc1155.createTokens(deployer.address,i,quantityOfERC1155Tokens,'0x00',"name","description","image url");
      expect(operation.hash).to.have.lengthOf(66);
    }
  });

  it("Verify ERC1155 tokens ownership", async function () {
    const [deployer] = await ethers.getSigners();
    for ( let i = 0 ; i < nrOfERC1155Tokens ; ++i ) {
      let operation = await erc1155.balanceOf(deployer.address,i);
      console.log(">> " + i + " === " + JSON.stringify(operation));
      expect(BigNumber.from(quantityOfERC1155Tokens) === operation.hex);
    }
  });

});