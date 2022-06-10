import { expect } from "chai";
import { Contract } from "ethers";
import { deployERC20 } from './routines/deploy-erc20/index';
import { ERC20Constructor } from './routines/contract/erc20.dto';
import { deployNoConstructor } from "./routines/deploy-no-constructor";
import { main as LendingTemplateValidator } from './routines/checks/lending-control-variables';
import { deployERC721 } from "./routines/deploy-erc721";
import { ERC721Constructor } from './routines/contract/erc721.dto';
import { LendingTemplateControlVariables } from './routines/checks/lending-control-variables/index-params.dto';
import { main as CreateLoan } from './routines/create-loan/index';
import { CreateLoanParams } from './routines/create-loan/index-params.dto';


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

  describe("Verify lending contracts", function () {
    it("Verification", async function () {
      let validation: Boolean = await LendingTemplateValidator(new LendingTemplateControlVariables({
        lendingMethods: LENDING_METHODS,
        lendingTemplate: LENDING_TEMPLATE,
        discountsAddress: DISCOUNTS.address
      }));
      if ( !validation ) {
        expect.fail("Failed");
      }
    });
  });

});



describe("<< Lending Workflow >>", function () {

  describe("Create loan", function () {
    it("Creation", async function () {
      let loan: any = await CreateLoan(new CreateLoanParams({
        erc1155: ERC1155,
        erc20: ERC20,
        erc721: ERC721,
        lending: LENDING_TEMPLATE
      }));
    });
  });

});