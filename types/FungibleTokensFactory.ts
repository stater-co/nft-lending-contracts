/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { FungibleTokens } from "./FungibleTokens";

export class FungibleTokensFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    initialSupply: BigNumberish,
    tokenName: string,
    tokenSymbol: string,
    overrides?: Overrides
  ): Promise<FungibleTokens> {
    return super.deploy(
      initialSupply,
      tokenName,
      tokenSymbol,
      overrides || {}
    ) as Promise<FungibleTokens>;
  }
  getDeployTransaction(
    initialSupply: BigNumberish,
    tokenName: string,
    tokenSymbol: string,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(
      initialSupply,
      tokenName,
      tokenSymbol,
      overrides || {}
    );
  }
  attach(address: string): FungibleTokens {
    return super.attach(address) as FungibleTokens;
  }
  connect(signer: Signer): FungibleTokensFactory {
    return super.connect(signer) as FungibleTokensFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FungibleTokens {
    return new Contract(address, _abi, signerOrProvider) as FungibleTokens;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "initialSupply",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "tokenName",
        type: "string",
      },
      {
        internalType: "string",
        name: "tokenSymbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Burn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040526002805460ff1916601217905534801561001d57600080fd5b50604051610aa2380380610aa28339818101604052606081101561004057600080fd5b81516020830180516040519294929383019291908464010000000082111561006757600080fd5b90830190602082018581111561007c57600080fd5b825164010000000081118282018810171561009657600080fd5b82525081516020918201929091019080838360005b838110156100c35781810151838201526020016100ab565b50505050905090810190601f1680156100f05780820380516001836020036101000a031916815260200191505b506040526020018051604051939291908464010000000082111561011357600080fd5b90830190602082018581111561012857600080fd5b825164010000000081118282018810171561014257600080fd5b82525081516020918201929091019080838360005b8381101561016f578181015183820152602001610157565b50505050905090810190601f16801561019c5780820380516001836020036101000a031916815260200191505b50604090815260025460ff16600a0a87026003819055336000908152600560209081529281209190915586516101da9550909350908601915061020a565b5080516101ee90600190602084019061020a565b5050600480546001600160a01b031916331790555061029d9050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061024b57805160ff1916838001178555610278565b82800160010185558215610278579182015b8281111561027857825182559160200191906001019061025d565b50610284929150610288565b5090565b5b808211156102845760008155600101610289565b6107f6806102ac6000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c806370a082311161008c57806395d89b411161006657806395d89b4114610292578063a9059cbb1461029a578063dd62ed3e146102c6578063f2fde38b146102f4576100cf565b806370a082311461021c57806379cc6790146102425780638da5cb5b1461026e576100cf565b806306fdde03146100d4578063095ea7b31461015157806318160ddd1461019157806323b872dd146101ab578063313ce567146101e157806342966c68146101ff575b600080fd5b6100dc61031c565b6040805160208082528351818301528351919283929083019185019080838360005b838110156101165781810151838201526020016100fe565b50505050905090810190601f1680156101435780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61017d6004803603604081101561016757600080fd5b506001600160a01b0381351690602001356103aa565b604080519115158252519081900360200190f35b610199610410565b60408051918252519081900360200190f35b61017d600480360360608110156101c157600080fd5b506001600160a01b03813581169160208101359091169060400135610416565b6101e9610485565b6040805160ff9092168252519081900360200190f35b61017d6004803603602081101561021557600080fd5b503561048e565b6101996004803603602081101561023257600080fd5b50356001600160a01b0316610506565b61017d6004803603604081101561025857600080fd5b506001600160a01b038135169060200135610518565b6102766105e9565b604080516001600160a01b039092168252519081900360200190f35b6100dc6105f8565b61017d600480360360408110156102b057600080fd5b506001600160a01b038135169060200135610652565b610199600480360360408110156102dc57600080fd5b506001600160a01b0381358116916020013516610668565b61031a6004803603602081101561030a57600080fd5b50356001600160a01b0316610685565b005b6000805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156103a25780601f10610377576101008083540402835291602001916103a2565b820191906000526020600020905b81548152906001019060200180831161038557829003601f168201915b505050505081565b3360008181526006602090815260408083206001600160a01b038716808552908352818420869055815186815291519394909390927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925928290030190a350600192915050565b60035481565b6001600160a01b038316600090815260066020908152604080832033845290915281205482111561044657600080fd5b6001600160a01b038416600090815260066020908152604080832033845290915290208054839003905561047b8484846106be565b5060019392505050565b60025460ff1681565b336000908152600560205260408120548211156104aa57600080fd5b3360008181526005602090815260409182902080548690039055600380548690039055815185815291517fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca59281900390910190a2506001919050565b60056020526000908152604090205481565b6001600160a01b03821660009081526005602052604081205482111561053d57600080fd5b6001600160a01b038316600090815260066020908152604080832033845290915290205482111561056d57600080fd5b6001600160a01b0383166000818152600560209081526040808320805487900390556006825280832033845282529182902080548690039055600380548690039055815185815291517fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca59281900390910190a250600192915050565b6004546001600160a01b031681565b60018054604080516020600284861615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156103a25780601f10610377576101008083540402835291602001916103a2565b600061065f3384846106be565b50600192915050565b600660209081526000928352604080842090915290825290205481565b6004546001600160a01b0316331461069c57600080fd5b600480546001600160a01b0319166001600160a01b0392909216919091179055565b6001600160a01b0382166106d157600080fd5b6001600160a01b0383166000908152600560205260409020548111156106f657600080fd5b6001600160a01b0382166000908152600560205260409020548181011161071c57600080fd5b6001600160a01b038083166000818152600560209081526040808320805495891680855282852080548981039091559486905281548801909155815187815291519390950194927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929181900390910190a36001600160a01b038084166000908152600560205260408082205492871682529020540181146107ba57fe5b5050505056fea264697066735822122077014c7da208ba087422c66e8604289dc6b77f4d064944ca3137a9e2103b84a364736f6c634300060c0033";
