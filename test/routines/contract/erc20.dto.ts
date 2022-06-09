import { ContractParams } from "./index.dto";
export class ERC20Constructor extends ContractParams {
  totalSupply: string;
  name: string;
  symbol: string;


  constructor(input: ERC20Constructor) {
    super(new ContractParams({
      contractName: input.contractName,
      contractAddress: input.contractAddress
    }))
    this.totalSupply = input.totalSupply;
    this.name = input.name;
    this.symbol = input.symbol;
  }
}