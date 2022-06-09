import { Contract } from "ethers";

export class CreateLoanParams {
  erc20: Contract;
  erc721: Contract
  erc1155: Contract;
  lending: Contract
  
  constructor(input: CreateLoanParams) {
    this.erc20 = input.erc20;
    this.erc721 = input.erc721;
    this.erc1155 = input.erc1155;
    this.lending = input.lending;
  }
}