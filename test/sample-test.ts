import "mocha";
import { expect } from "chai";
import { Contract } from "ethers";
import { deployERC20 } from './routines/deploy-erc20/index';
import { ERC20Constructor } from './routines/contract/erc20.dto';
import { deployNoConstructor } from "./routines/deploy-no-constructor";
import { main as LendingTemplateValidator } from './routines/checks/validate-lending-template/valid-lending-template';
import { deployERC721 } from "./routines/deploy-erc721";
import { ERC721Constructor } from './routines/contract/erc721.dto';
import { ValidLendingTemplateParams } from './routines/checks/validate-lending-template/index-params.dto';


let ERC20: Contract;
let DISCOUNTS: Contract;
let ERC721: Contract;
let ERC1155: Contract;
let ERC20_STAKING: Contract;
let ERC20_DISTRIBUTION: Contract;
let LENDING_METHODS: Contract;
let LENDING_TEMPLATE: Contract;



describe("<< Environment Smart Contracts Setup >>", function () {

  describe("Deploy ERC20 contract", function () {
    it("Deployment", async function () {
      ERC20 = await deployERC20(new ERC20Constructor({
        contractName: "FungibleTokens",
        name: "ERC20",
        symbol: "ERC20",
        totalSupply: "0x174876E800"
      }));
    });
  });
  
  describe("Deploy Discounts contract", function () {
    it("Deployment", async function () {
      DISCOUNTS = await deployNoConstructor("StaterDiscounts");
    });
  });

  describe("Deploy ERC721 contract", function () {
    it("Deployment", async function () {
      ERC721 = await deployNoConstructor("GameItems721");
    });
  });

  describe("Deploy ERC1155 contract", function () {
    it("Deployment", async function () {
      ERC1155 = await deployNoConstructor("GameItems1155");
    });
  });

  describe("Deploy the Staking contract", function () {
    it("Deployment", async function () {
      ERC20_STAKING = await deployERC20(new ERC20Constructor({
        contractName: "FungibleTokens",
        name: "Test Staking Tokens",
        symbol: "TST",
        totalSupply: "0x174876E800"
      }));
    });
  });

  describe("Deploy the Distribution contract", function () {
    it("Deployment", async function () {
      ERC20_DISTRIBUTION = await deployERC20(new ERC20Constructor({
        contractName: "FungibleTokens",
        name: "Test Distribution Tokens",
        symbol: "TDT",
        totalSupply: "0x174876E800"
      }));
    });
  });

});



describe("<< Lending Smart Contracts Setup >>", function () {

  describe("Deploy the lending methods contract", function () {
    it("Deployment", async function () {
      LENDING_METHODS = await deployERC721(new ERC721Constructor({
        contractName: "LendingMethods",
        name: "Lending Methods",
        symbol: "LM"
      }));
    });
  });

  describe("Deploy the lending template contract", function () {
    it("Deployment", async function () {
      LENDING_TEMPLATE = await deployERC721(new ERC721Constructor({
        contractName: "LendingTemplate",
        name: "Lending Template",
        symbol: "LT"
      }));
    });
  });

  describe("Verify lending contracts", async function () {
    it("Verification", async function () {
      let validation: Boolean = await LendingTemplateValidator(new ValidLendingTemplateParams({
        lendingMethods: LENDING_METHODS,
        lendingMethodsAddress: LENDING_METHODS.address,
        lendingTemplate: LENDING_TEMPLATE,
        lendingTemplateAddress: LENDING_TEMPLATE.address,
        discountsAddress: DISCOUNTS.address
      }));
      if ( !validation ) {
        expect.fail("Failed");
      }
    });
  });

});