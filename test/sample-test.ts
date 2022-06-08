import { expect } from "chai";
import { BigNumber, Contract, Wallet } from "ethers";
import { ethers } from "hardhat";
import { deployERC20 } from './routines/deploy-erc20/index';
import { params, IndexParams as ERC20Params, ERC20Constructor } from './routines/deploy-erc20/index-params.dto';
import { deployNoConstructor } from "./routines/deploy-no-constructor";
import { IndexParams as NoConstructorIndexParams } from './routines/deploy-no-constructor/index-params.dto';
import { CreateLoanParams, EditLoanParams, LendingMethods } from '../types/LendingMethods';
import { LendingConstructor, LendingTemplate } from '../types/LendingTemplate';
import { LendingMethods__factory } from '../types/factories/LendingMethods__factory';
import { LendingTemplate__factory } from '../types/factories/LendingTemplate__factory';
import { StaterDiscounts__factory } from '../types/factories/StaterDiscounts__factory';
import { main as LendingTemplateValidator } from './routines/checks/valid-lending-template';
import { StaterDiscounts } from "../types/StaterDiscounts";


let ERC20: Contract;
let DISCOUNTS: Contract;
let ERC721: Contract;
let ERC1155: Contract;
let ERC20_STAKING: Contract;
let ERC20_DISTRIBUTION: Contract;
let DISCOUNTS_CONNECTED: StaterDiscounts;
let LENDING_METHODS: Contract;
let LENDING_METHODS_CONNECTION: LendingMethods;
let LENDING_TEMPLATE: Contract;
let LENDING_TEMPLATE_CONNECTION: LendingTemplate;



describe("<< Environment Smart Contracts Setup >>", async function () {
  ERC20 = await deployERC20(params);
  DISCOUNTS = await deployNoConstructor(new NoConstructorIndexParams({
    contractName: "StaterDiscounts",
    describeLabel: "Deploy Discounts contract",
    itLabel: "Deployment"
  }));
  const wallet = new Wallet(String(process.env.ACCOUNT_PRIVATE_KEY));
  DISCOUNTS_CONNECTED = StaterDiscounts__factory.connect(DISCOUNTS.address,wallet);
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



describe("<< Lending Smart Contracts Setup >>", async function () {
  console.log("ok 1");
  LENDING_METHODS = await deployNoConstructor(new NoConstructorIndexParams({
    contractName: "LendingMethods",
    describeLabel: "Deploy the Lending Methods contract",
    itLabel: "Deployment"
  }));
  console.log("ok 2");
  const wallet = new Wallet(String(process.env.ACCOUNT_PRIVATE_KEY));
  LENDING_METHODS_CONNECTION = LendingMethods__factory.connect(LENDING_METHODS.address,wallet);
  console.log("ok 3");
  LENDING_TEMPLATE = await deployNoConstructor(new NoConstructorIndexParams({
    contractName: "LendingTemplate",
    describeLabel: "Deploy the Lending Template contract",
    itLabel: "Deployment"
  }));
  console.log("ok 4");
  LENDING_TEMPLATE_CONNECTION = LendingTemplate__factory.connect(LENDING_TEMPLATE.address,wallet);
  console.log("ok 5");
  it('Verify Lending Template props', async () => await LendingTemplateValidator(
    LENDING_TEMPLATE_CONNECTION,
    LENDING_TEMPLATE_CONNECTION.address,
    LENDING_METHODS_CONNECTION,
    LENDING_METHODS_CONNECTION.address
  ));
  console.log("ok 6");
});

