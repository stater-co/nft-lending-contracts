const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");


let discounts, erc721, erc1155, tokenGeyser, stakingTokens, distributionTokens;


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

  it("Create ERC721 token, 1", async function () {
    let operation = await erc721.createItem("Token 1", "Token 1 description", "Token 1 URL");
    expect(operation.hash).to.have.lengthOf(66);
  });

  it("Create ERC721 token, 2", async function () {
    let operation = await erc721.createItem("Token 2", "Token 2 description", "Token 2 URL");
    expect(operation.hash).to.have.lengthOf(66);
  });

  it("Create ERC721 token, 3", async function () {
    let operation = await erc721.createItem("Token 3", "Token 3 description", "Token 3 URL");
    expect(operation.hash).to.have.lengthOf(66);
  });

  it("Verify ERC721 tokens ownership", async function () {
    const [deployer] = await ethers.getSigners();
    let operation = await erc721.balanceOf(deployer.address);
    expect(BigNumber.eq(BigNumber.from(3)));

    
  });

});