import { Contract } from "ethers";

export class ValidLendingTemplateParams {
  lendingTemplate: Contract;
  lendingTemplateAddress: string;
  lendingMethods: Contract;
  lendingMethodsAddress: string;
  discountsAddress: string;
  
  constructor(input: ValidLendingTemplateParams) {
    this.lendingTemplate = input.lendingTemplate;
    this.lendingTemplateAddress = input.lendingTemplateAddress;
    this.lendingMethods = input.lendingMethods;
    this.lendingMethodsAddress = input.lendingMethodsAddress;
    this.discountsAddress = input.discountsAddress;
  }
}