const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");


let discounts, erc721, erc1155, tokenGeyser, stakingTokens, distributionTokens, promissoryNote, lendingMethods, lendingTemplate, erc20;
const nrOfERC721Tokens = 100, nrOfERC1155Tokens = 100, quantityOfERC1155Tokens = 1000;
const nrOfWorkflowsToTest = 5;


describe("Smart Contracts Setup", function () {

  it("Should deploy the erc20 contract", async function () {
    const FungibleTokens = await ethers.getContractFactory("FungibleTokens");
    const _fungibleTokens = await FungibleTokens.deploy(BigNumber.from("1000000000000000000"),"Test ERC20","TERC20");
    await _fungibleTokens.deployed();
    expect(_fungibleTokens.address).to.have.lengthOf(42);
    erc20 = _fungibleTokens;
  });

  it("Should deploy the discounts contract", async function () {
    const Discounts = await ethers.getContractFactory("StaterDiscounts");
    const _discounts = await Discounts.deploy();
    await _discounts.deployed();
    expect(_discounts.address).to.have.lengthOf(42);
    discounts = _discounts;
  });

  it("Should deploy the ERC721 contract", async function () {
    const NFT721 = await ethers.getContractFactory("GameItems721");
    const _nft721 = await NFT721.deploy();
    await _nft721.deployed();
    expect(_nft721.address).to.have.lengthOf(42);
    erc721 = _nft721;
  });

  it("Should deploy the ERC1155 contract", async function () {
    const NFT1155 = await ethers.getContractFactory("GameItems1155");
    const _nft1155 = await NFT1155.deploy();
    await _nft1155.deployed();
    expect(_nft1155.address).to.have.lengthOf(42);
    erc1155 = _nft1155;
  });

  it("Should deploy the promissory contract", async function () {
    const PromissoryNote = await ethers.getContractFactory("StaterPromissoryNote");
    const _promissoryNote = await PromissoryNote.deploy("Stater Promissory Note","SPM");
    await _promissoryNote.deployed();
    expect(_promissoryNote.address).to.have.lengthOf(42);
    promissoryNote = _promissoryNote;
  });

  it("Should deploy the token geyser contract", async function () {

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

  it("Should deploy the lending methods", async function () {
    const LendingMethods = await ethers.getContractFactory("LendingMethods");
    const _lendingMethods = await LendingMethods.deploy();
    await _lendingMethods.deployed();
    expect(_lendingMethods.address).to.have.lengthOf(42);
    lendingMethods = _lendingMethods;
  });

  it("Should deploy the lending template", async function () {
    const LendingTemplate = await ethers.getContractFactory("LendingTemplate");
    const _lendingTemplate = await LendingTemplate.deploy(promissoryNote.address,lendingMethods.address,discounts.address);
    await _lendingTemplate.deployed();
    expect(_lendingTemplate.address).to.have.lengthOf(42);
    lendingTemplate = _lendingTemplate;
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
      expect(BigNumber.from(quantityOfERC1155Tokens) === operation.hex);
    }
  });

  it("Should set the lending template address on the promissory note contract", async function () {
    const operation = await promissoryNote.setLendingDataAddress(lendingTemplate.address);
    expect(operation.hash).to.have.lengthOf(66);
  });

  it("Should create the ERC721 discount", async function () {
    const operation = await discounts.addDiscount(0,erc721.address,4,[...Array(nrOfERC721Tokens).keys()]);
    expect(operation.hash).to.have.lengthOf(66);
  });

  it("Should create the ERC1155 discount", async function () {
    const operation = await discounts.addDiscount(1,erc1155.address,2,[...Array(nrOfERC1155Tokens).keys()]);
    expect(operation.hash).to.have.lengthOf(66);
  });

  it("Should create the token geyser discount", async function () {
    const operation = await discounts.addDiscount(1,tokenGeyser.address,6,[]);
    expect(operation.hash).to.have.lengthOf(66);
  });

  it("Check discounts token ids limit for erc721", async function () {
    let tokenId0;
    try {
      tokenId0 = await discounts.getDiscountTokenId(0,0);
    } catch (err) {
      expect(false);
    }
    let tokenIdLast;
    try {
      tokenIdLast = await discounts.getDiscountTokenId(0,nrOfERC721Tokens-1);
    } catch (err) {
      expect(false);
    }

    expect(tokenId0 === 0);
    expect(tokenIdLast === nrOfERC721Tokens);
  });

  it("Check discounts token ids limit for erc1155", async function () {
    let tokenId0;
    try {
      tokenId0 = await discounts.getDiscountTokenId(1,0);
    } catch (err) {
      expect(false);
    }
    let tokenIdLast;
    try {
      tokenIdLast = await discounts.getDiscountTokenId(1,nrOfERC1155Tokens-1);
    } catch (err) {
      expect(false);
    }

    expect(tokenId0 === 0);
    expect(tokenIdLast === nrOfERC1155Tokens);
  });

  it("Check discounts token ids limit for token geyser", async function () {
    let tokenId0;
    try {
      tokenId0 = await discounts.getDiscountTokenId(2,0);
    } catch (err) {
      expect(false);
    }
    expect(tokenId0 === undefined);
  });

  it("Approve lending template on erc1155 contract", async function () {
    const operation = await erc1155.setApprovalForAll(lendingTemplate.address,true);
    expect(operation.hash).to.have.lengthOf(66);
  });

  it("Check lending template approval on erc1155 contract", async function () {
    const [deployer] = await ethers.getSigners();
    const isApproved = await erc1155.isApprovedForAll(deployer.address,lendingTemplate.address);
    expect(isApproved);
  });

  it("Approve lending template on erc721 contract", async function () {
    const operation = await erc721.setApprovalForAll(lendingTemplate.address,true);
    expect(operation.hash).to.have.lengthOf(66);
  });

  it("Check lending template approval on erc721 contract", async function () {
    const [deployer] = await ethers.getSigners();
    const isApproved = await erc721.isApprovedForAll(deployer.address,lendingTemplate.address);
    expect(isApproved);
  });

});


describe("Lending Unit Tests", function () {

  for ( let i = 0 , l = nrOfWorkflowsToTest; i < l; ++i ) {
    it("Create loan: " + i, async function () {
      const randomValue = Math.floor(Math.random() * 999999999999999) + 1;
      const randomLtv = Math.floor(Math.random() * 60) + 1;
      const assetsValue = randomValue;
      const loanValue = parseInt((assetsValue / 100) * randomLtv);
      const nrOfInstallments = Math.floor(Math.random() * 20) + 1;
      const currency = Math.floor(Math.random() * 2) + 1 === 1 ? "0x0000000000000000000000000000000000000000" : erc20.address;
      const nrOfAssets = Math.floor(Math.random() * 10) + 1;
      let nftAddressArray = [];
      let nftTokenIdArray = [];
      let nftTokenTypeArray = [];
      let randomTokenId;
      for ( let i = 0 , l = nrOfAssets; i < l; ++i ) {
        const assetType = Math.floor(Math.random() * 2);
        switch ( assetType ) {
          case 0:
            // ERC721
            randomTokenId = Math.floor(Math.random() * nrOfERC721Tokens);
            nftAddressArray.push(erc721.address);
            nftTokenIdArray.push(randomTokenId);
          break;

          case 1:
            // ERC1155
            randomTokenId = Math.floor(Math.random() * nrOfERC1155Tokens);
            nftAddressArray.push(erc1155.address);
            nftTokenIdArray.push(randomTokenId);
          break;
        }
        nftTokenTypeArray.push(assetType);
      }

      console.log("============= " + i + " =============");
      console.log(loanValue + " | " + nrOfInstallments + " | " + currency + " | " + assetsValue + " | " + nftAddressArray + " | " + nftTokenIdArray + " | " + nftTokenTypeArray);
      const operation = await lendingTemplate.createLoan(loanValue,nrOfInstallments,currency,assetsValue,nftAddressArray,nftTokenIdArray,nftTokenTypeArray);
      expect(operation.hash).to.have.lengthOf(66);
      
    });

    it("Check loan " + i + " existence", async function () {
      const loan = await lendingTemplate.loans(i+1);
      expect(loan !== undefined);
    });
  }

});