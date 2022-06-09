import { ContractParams } from "./index.dto";
export class ERC721Constructor extends ContractParams {
  name: string;
  symbol: string;


  constructor(input: ERC721Constructor) {
    super(new ContractParams({
      contractName: input.contractName,
      contractAddress: input.contractAddress
    }));
    this.name = input.name;
    this.symbol = input.symbol;
  }
}