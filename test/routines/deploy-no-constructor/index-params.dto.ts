export class IndexParams {
  describeLabel: string;
  itLabel: string;
  contractName: string;


  constructor(input: IndexParams) {
    this.describeLabel = input.describeLabel;
    this.itLabel = input.itLabel;
    this.contractName = input.contractName;
  }
}