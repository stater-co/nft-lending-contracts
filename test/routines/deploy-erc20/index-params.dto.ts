export class ERC20Constructor {
    totalSupply: string;
    name: string;
    symbol: string;
  
  
    constructor(input: ERC20Constructor) {
      this.totalSupply = input.totalSupply;
      this.name = input.name;
      this.symbol = input.symbol;
    }
  }

export class IndexParams {
  describeLabel: string;
  itLabel: string;
  contractName: string;
  constructorParams: ERC20Constructor


  constructor(input: IndexParams) {
    this.describeLabel = input.describeLabel;
    this.itLabel = input.itLabel;
    this.contractName = input.contractName;
    this.constructorParams = input.constructorParams;
  }
}


export const params: IndexParams = new IndexParams({
    describeLabel: "Deploy ERC20 contract",
    itLabel: "Deployment",
    contractName: "FungibleTokens",
    constructorParams: new ERC20Constructor({
      name: "ERC20",
      symbol: "ERC20",
      totalSupply: "0x174876E800"
    })
  });