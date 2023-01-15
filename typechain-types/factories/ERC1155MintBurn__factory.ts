/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ERC1155MintBurn,
  ERC1155MintBurnInterface,
} from "../ERC1155MintBurn";

const _abi = [
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
        name: "_operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "_amounts",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
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
        internalType: "address[]",
        name: "_owners",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "isOperator",
        type: "bool",
      },
    ],
    stateMutability: "view",
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
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
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
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_interfaceID",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611a87806100206000396000f3fe608060405234801561001057600080fd5b506004361061007c5760003560e01c80634e1273f41161005b5780634e1273f414610369578063a22cb4651461050a578063e985e9c51461055a578063f242432a146105d45761007c565b8062fdd58e1461008157806301ffc9a7146100e35780632eb2c2d614610146575b600080fd5b6100cd6004803603604081101561009757600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506106e3565b6040518082815260200191505060405180910390f35b61012e600480360360208110156100f957600080fd5b8101908080357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916906020019092919050505061073d565b60405180821515815260200191505060405180910390f35b610367600480360360a081101561015c57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156101b957600080fd5b8201836020820111156101cb57600080fd5b803590602001918460208302840111640100000000831117156101ed57600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561024d57600080fd5b82018360208201111561025f57600080fd5b8035906020019184602083028401116401000000008311171561028157600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156102e157600080fd5b8201836020820111156102f357600080fd5b8035906020019184600183028401116401000000008311171561031557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506107bf565b005b6104b36004803603604081101561037f57600080fd5b810190808035906020019064010000000081111561039c57600080fd5b8201836020820111156103ae57600080fd5b803590602001918460208302840111640100000000831117156103d057600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561043057600080fd5b82018360208201111561044257600080fd5b8035906020019184602083028401116401000000008311171561046457600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f8201169050808301925050505050505091929192905050506108fb565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156104f65780820151818401526020810190506104db565b505050509050019250505060405180910390f35b6105586004803603604081101561052057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803515159060200190929190505050610a55565b005b6105bc6004803603604081101561057057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610b54565b60405180821515815260200191505060405180910390f35b6106e1600480360360a08110156105ea57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190803590602001909291908035906020019064010000000081111561065b57600080fd5b82018360208201111561066d57600080fd5b8035906020019184600183028401116401000000008311171561068f57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610be8565b005b60008060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600083815260200190815260200160002054905092915050565b60007fd9b67a26000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614156107ae57600190506107ba565b6107b782610d24565b90505b919050565b8473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806107ff57506107fe8533610b54565b5b610854576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602f8152602001806119aa602f913960400191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614156108da576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252603081526020018061194e6030913960400191505060405180910390fd5b6108e685858585610d75565b6108f4858585855a866110d7565b5050505050565b60608151835114610957576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602c81526020018061197e602c913960400191505060405180910390fd5b6000835167ffffffffffffffff8111801561097157600080fd5b506040519080825280602002602001820160405280156109a05781602001602082028036833780820191505090505b50905060005b8451811015610a4a576000808683815181106109be57fe5b602002602001015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000858381518110610a0e57fe5b6020026020010151815260200190815260200160002054828281518110610a3157fe5b60200260200101818152505080806001019150506109a6565b508091505092915050565b80600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c318360405180821515815260200191505060405180910390a35050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b8473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480610c285750610c278533610b54565b5b610c7d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602a8152602001806118ef602a913960400191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415610d03576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602b8152602001806118c4602b913960400191505060405180910390fd5b610d0f85858585611369565b610d1d858585855a8661155d565b5050505050565b60006301ffc9a760e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b8051825114610dcf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260358152602001806119196035913960400191505060405180910390fd5b60008251905060005b81811015610fc957610e68838281518110610def57fe5b60200260200101516000808973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000878581518110610e4357fe5b602002602001015181526020019081526020016000205461176d90919063ffffffff16565b6000808873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000868481518110610eb457fe5b6020026020010151815260200190815260200160002081905550610f56838281518110610edd57fe5b60200260200101516000808873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000878581518110610f3157fe5b60200260200101518152602001908152602001600020546117f690919063ffffffff16565b6000808773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000868481518110610fa257fe5b60200260200101518152602001908152602001600020819055508080600101915050610dd8565b508373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8686604051808060200180602001838103835285818151815260200191508051906020019060200280838360005b8381101561107957808201518184015260208101905061105e565b50505050905001838103825284818151815260200191508051906020019060200280838360005b838110156110bb5780820151818401526020810190506110a0565b5050505090500194505050505060405180910390a45050505050565b6110f68573ffffffffffffffffffffffffffffffffffffffff1661187e565b156113615760008573ffffffffffffffffffffffffffffffffffffffff1663bc197c8184338a8989886040518763ffffffff1660e01b8152600401808673ffffffffffffffffffffffffffffffffffffffff1681526020018573ffffffffffffffffffffffffffffffffffffffff168152602001806020018060200180602001848103845287818151815260200191508051906020019060200280838360005b838110156111b1578082015181840152602081019050611196565b50505050905001848103835286818151815260200191508051906020019060200280838360005b838110156111f35780820151818401526020810190506111d8565b50505050905001848103825285818151815260200191508051906020019080838360005b83811015611232578082015181840152602081019050611217565b50505050905090810190601f16801561125f5780820380516001836020036101000a031916815260200191505b5098505050505050505050602060405180830381600088803b15801561128457600080fd5b5087f1158015611298573d6000803e3d6000fd5b50505050506040513d60208110156112af57600080fd5b8101908080519060200190929190505050905063bc197c8160e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161461135f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252603f8152602001806119d9603f913960400191505060405180910390fd5b505b505050505050565b6113cb816000808773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008581526020019081526020016000205461176d90919063ffffffff16565b6000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600084815260200190815260200160002081905550611480816000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000858152602001908152602001600020546117f690919063ffffffff16565b6000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000848152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f628585604051808381526020018281526020019250505060405180910390a450505050565b61157c8573ffffffffffffffffffffffffffffffffffffffff1661187e565b156117655760008573ffffffffffffffffffffffffffffffffffffffff1663f23a6e6184338a8989886040518763ffffffff1660e01b8152600401808673ffffffffffffffffffffffffffffffffffffffff1681526020018573ffffffffffffffffffffffffffffffffffffffff16815260200184815260200183815260200180602001828103825283818151815260200191508051906020019080838360005b8381101561163857808201518184015260208101905061161d565b50505050905090810190601f1680156116655780820380516001836020036101000a031916815260200191505b509650505050505050602060405180830381600088803b15801561168857600080fd5b5087f115801561169c573d6000803e3d6000fd5b50505050506040513d60208110156116b357600080fd5b8101908080519060200190929190505050905063f23a6e6160e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614611763576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252603a815260200180611a18603a913960400191505060405180910390fd5b505b505050505050565b6000828211156117e5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260178152602001807f536166654d617468237375623a20554e444552464c4f5700000000000000000081525060200191505060405180910390fd5b600082840390508091505092915050565b600080828401905083811015611874576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f536166654d617468236164643a204f564552464c4f570000000000000000000081525060200191505060405180910390fd5b8091505092915050565b600080823f90506000801b81141580156118bb57507fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a47060001b8114155b91505091905056fe4552433131353523736166655472616e7366657246726f6d3a20494e56414c49445f524543495049454e544552433131353523736166655472616e7366657246726f6d3a20494e56414c49445f4f50455241544f5245524331313535235f7361666542617463685472616e7366657246726f6d3a20494e56414c49445f4152524159535f4c454e47544845524331313535237361666542617463685472616e7366657246726f6d3a20494e56414c49445f524543495049454e54455243313135352362616c616e63654f6642617463683a20494e56414c49445f41525241595f4c454e47544845524331313535237361666542617463685472616e7366657246726f6d3a20494e56414c49445f4f50455241544f5245524331313535235f63616c6c6f6e45524331313535426174636852656365697665643a20494e56414c49445f4f4e5f524543454956455f4d45535341474545524331313535235f63616c6c6f6e4552433131353552656365697665643a20494e56414c49445f4f4e5f524543454956455f4d455353414745a264697066735822122016b8a4ea4a9b4288c25e3f777eda260f89a73a3e75964f5f073d8d4014e269e064736f6c63430007060033";

type ERC1155MintBurnConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC1155MintBurnConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC1155MintBurn__factory extends ContractFactory {
  constructor(...args: ERC1155MintBurnConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "ERC1155MintBurn";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ERC1155MintBurn> {
    return super.deploy(overrides || {}) as Promise<ERC1155MintBurn>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ERC1155MintBurn {
    return super.attach(address) as ERC1155MintBurn;
  }
  connect(signer: Signer): ERC1155MintBurn__factory {
    return super.connect(signer) as ERC1155MintBurn__factory;
  }
  static readonly contractName: "ERC1155MintBurn";
  public readonly contractName: "ERC1155MintBurn";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC1155MintBurnInterface {
    return new utils.Interface(_abi) as ERC1155MintBurnInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC1155MintBurn {
    return new Contract(address, _abi, signerOrProvider) as ERC1155MintBurn;
  }
}
