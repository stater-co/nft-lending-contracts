/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import type { ILendingTemplate } from "./ILendingTemplate";

export class ILendingTemplateFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ILendingTemplate {
    return new Contract(address, _abi, signerOrProvider) as ILendingTemplate;
  }
}

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "ltv",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "interestRate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "interestRateToStater",
            type: "uint256",
          },
          {
            internalType: "uint32",
            name: "lenderFee",
            type: "uint32",
          },
        ],
        internalType: "struct ILendingTemplate.LoanFeesHandler",
        name: "feesHandler",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "address",
            name: "loanHandler",
            type: "address",
          },
          {
            internalType: "address",
            name: "promissoryHandler",
            type: "address",
          },
          {
            internalType: "address",
            name: "discountsHandler",
            type: "address",
          },
          {
            internalType: "address",
            name: "poolHandler",
            type: "address",
          },
        ],
        internalType: "struct ILendingTemplate.Handlers",
        name: "handlers",
        type: "tuple",
      },
    ],
    name: "setGlobalVariables",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
