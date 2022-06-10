import { Contract } from "ethers";

export class LendingTemplateControlVariables {
  lendingTemplate: Contract;
  lendingMethods: Contract;
  discountsAddress: string;
  
  constructor(input: LendingTemplateControlVariables) {
    this.lendingTemplate = input.lendingTemplate;
    this.lendingMethods = input.lendingMethods;
    this.discountsAddress = input.discountsAddress;
  }
}