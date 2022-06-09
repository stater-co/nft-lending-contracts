export class ContractParams {
    contractName: string;
    contractAddress?: string;
  
  
    constructor(input: ContractParams) {
      this.contractName = input.contractName;
      this.contractAddress = input.contractAddress;
    }
  }