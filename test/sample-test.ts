import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";
import { deployERC20 } from './routines/deploy-erc20/index';
import { params, IndexParams as ERC20Params, ERC20Constructor } from './routines/deploy-erc20/index-params.dto';
import { deployNoConstructor } from "./routines/deploy-no-constructor";
import { IndexParams as NoConstructorIndexParams } from './routines/deploy-no-constructor/index-params.dto';


let ERC20: Contract;
let DISCOUNTS: Contract;
let ERC721: Contract;
let ERC1155: Contract;
let ERC20_STAKING: Contract;
let ERC20_DISTRIBUTION: Contract;
describe("Environment Smart Contracts Setup", async function () {
  ERC20 = await deployERC20(params);
  DISCOUNTS = await deployNoConstructor(new NoConstructorIndexParams({
    contractName: "StaterDiscounts",
    describeLabel: "Deploy Discounts contract",
    itLabel: "Deployment"
  }));
  ERC721 = await deployNoConstructor(new NoConstructorIndexParams({
    contractName: "GameItems721",
    describeLabel: "Deploy ERC721 contract",
    itLabel: "Deployment"
  }));
  ERC1155 = await deployNoConstructor(new NoConstructorIndexParams({
    contractName: "GameItems1155",
    describeLabel: "Deploy ERC1155 contract",
    itLabel: "Deployment"
  }));
  ERC20_STAKING = await deployERC20(new ERC20Params({
    contractName: params.contractName,
    describeLabel: "Deploy the Staking contract",
    itLabel: "Deployment",
    constructorParams: new ERC20Constructor({
      name: "Test Staking Tokens",
      symbol: "TST",
      totalSupply: params.constructorParams.totalSupply
    })
  }));
  ERC20_DISTRIBUTION = await deployERC20(new ERC20Params({
    contractName: params.contractName,
    describeLabel: "Deploy the Distribution contract",
    itLabel: "Deployment",
    constructorParams: new ERC20Constructor({
      name: "Test Distribution Tokens",
      symbol: "TDT",
      totalSupply: params.constructorParams.totalSupply
    })
  }));
});


let LENDING_METHODS: Contract;
let LENDING_TEMPLATE: Contract;
describe("Lending Smart Contracts Setup", async function () {

});

