/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ERC1155OperatorMock,
  ERC1155OperatorMockInterface,
} from "../ERC1155OperatorMock";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
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
        internalType: "bool",
        name: "_isGasFee",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "metaSafeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
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
        internalType: "bool",
        name: "_isGasFee",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "metaSafeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
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
      {
        internalType: "bool",
        name: "_approved",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "_isGasFee",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "metaSetApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
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
        name: "_tokenAddress",
        type: "address",
      },
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610f93806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80637ee7f69b1461005c57806387fd22fc1461029f578063e7e4f052146103da578063eb46c45b14610629578063f06978b714610758575b600080fd5b61029d600480360360c081101561007257600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156100ef57600080fd5b82018360208201111561010157600080fd5b8035906020019184602083028401116401000000008311171561012357600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561018357600080fd5b82018360208201111561019557600080fd5b803590602001918460208302840111640100000000831117156101b757600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561021757600080fd5b82018360208201111561022957600080fd5b8035906020019184600183028401116401000000008311171561024b57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929050505061088b565b005b6103d8600480360360e08110156102b557600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190803590602001909291908035151590602001909291908035906020019064010000000081111561035257600080fd5b82018360208201111561036457600080fd5b8035906020019184600183028401116401000000008311171561038657600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610a31565b005b610627600480360360e08110156103f057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019064010000000081111561046d57600080fd5b82018360208201111561047f57600080fd5b803590602001918460208302840111640100000000831117156104a157600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561050157600080fd5b82018360208201111561051357600080fd5b8035906020019184602083028401116401000000008311171561053557600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f820116905080830192505050505050509192919290803515159060200190929190803590602001906401000000008111156105a157600080fd5b8201836020820111156105b357600080fd5b803590602001918460018302840111640100000000831117156105d557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610b60565b005b610756600480360360c081101561063f57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919080359060200190929190803590602001906401000000008111156106d057600080fd5b8201836020820111156106e257600080fd5b8035906020019184600183028401116401000000008311171561070457600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610d11565b005b610889600480360360c081101561076e57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035151590602001909291908035151590602001909291908035906020019064010000000081111561080357600080fd5b82018360208201111561081557600080fd5b8035906020019184600183028401116401000000008311171561083757600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610e35565b005b8573ffffffffffffffffffffffffffffffffffffffff16632eb2c2d686868686866040518663ffffffff1660e01b8152600401808673ffffffffffffffffffffffffffffffffffffffff1681526020018573ffffffffffffffffffffffffffffffffffffffff168152602001806020018060200180602001848103845287818151815260200191508051906020019060200280838360005b8381101561093e578082015181840152602081019050610923565b50505050905001848103835286818151815260200191508051906020019060200280838360005b83811015610980578082015181840152602081019050610965565b50505050905001848103825285818151815260200191508051906020019080838360005b838110156109bf5780820151818401526020810190506109a4565b50505050905090810190601f1680156109ec5780820380516001836020036101000a031916815260200191505b5098505050505050505050600060405180830381600087803b158015610a1157600080fd5b505af1158015610a25573d6000803e3d6000fd5b50505050505050505050565b8673ffffffffffffffffffffffffffffffffffffffff1663ce0b514b8787878787876040518763ffffffff1660e01b8152600401808773ffffffffffffffffffffffffffffffffffffffff1681526020018673ffffffffffffffffffffffffffffffffffffffff168152602001858152602001848152602001831515815260200180602001828103825283818151815260200191508051906020019080838360005b83811015610aee578082015181840152602081019050610ad3565b50505050905090810190601f168015610b1b5780820380516001836020036101000a031916815260200191505b50975050505050505050600060405180830381600087803b158015610b3f57600080fd5b505af1158015610b53573d6000803e3d6000fd5b5050505050505050505050565b8673ffffffffffffffffffffffffffffffffffffffff1663a3d4926e8787878787876040518763ffffffff1660e01b8152600401808773ffffffffffffffffffffffffffffffffffffffff1681526020018673ffffffffffffffffffffffffffffffffffffffff1681526020018060200180602001851515815260200180602001848103845288818151815260200191508051906020019060200280838360005b83811015610c1c578082015181840152602081019050610c01565b50505050905001848103835287818151815260200191508051906020019060200280838360005b83811015610c5e578082015181840152602081019050610c43565b50505050905001848103825285818151815260200191508051906020019080838360005b83811015610c9d578082015181840152602081019050610c82565b50505050905090810190601f168015610cca5780820380516001836020036101000a031916815260200191505b509950505050505050505050600060405180830381600087803b158015610cf057600080fd5b505af1158015610d04573d6000803e3d6000fd5b5050505050505050505050565b8573ffffffffffffffffffffffffffffffffffffffff1663f242432a86868686866040518663ffffffff1660e01b8152600401808673ffffffffffffffffffffffffffffffffffffffff1681526020018573ffffffffffffffffffffffffffffffffffffffff16815260200184815260200183815260200180602001828103825283818151815260200191508051906020019080838360005b83811015610dc5578082015181840152602081019050610daa565b50505050905090810190601f168015610df25780820380516001836020036101000a031916815260200191505b509650505050505050600060405180830381600087803b158015610e1557600080fd5b505af1158015610e29573d6000803e3d6000fd5b50505050505050505050565b8573ffffffffffffffffffffffffffffffffffffffff1663f5d4c82086868686866040518663ffffffff1660e01b8152600401808673ffffffffffffffffffffffffffffffffffffffff1681526020018573ffffffffffffffffffffffffffffffffffffffff1681526020018415158152602001831515815260200180602001828103825283818151815260200191508051906020019080838360005b83811015610eed578082015181840152602081019050610ed2565b50505050905090810190601f168015610f1a5780820380516001836020036101000a031916815260200191505b509650505050505050600060405180830381600087803b158015610f3d57600080fd5b505af1158015610f51573d6000803e3d6000fd5b5050505050505050505056fea264697066735822122026c61d3ac4a40213db98261e4cc4eea4959a07f7a3998910d6643281103c4cb764736f6c63430007060033";

type ERC1155OperatorMockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC1155OperatorMockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC1155OperatorMock__factory extends ContractFactory {
  constructor(...args: ERC1155OperatorMockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "ERC1155OperatorMock";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ERC1155OperatorMock> {
    return super.deploy(overrides || {}) as Promise<ERC1155OperatorMock>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ERC1155OperatorMock {
    return super.attach(address) as ERC1155OperatorMock;
  }
  connect(signer: Signer): ERC1155OperatorMock__factory {
    return super.connect(signer) as ERC1155OperatorMock__factory;
  }
  static readonly contractName: "ERC1155OperatorMock";
  public readonly contractName: "ERC1155OperatorMock";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC1155OperatorMockInterface {
    return new utils.Interface(_abi) as ERC1155OperatorMockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC1155OperatorMock {
    return new Contract(address, _abi, signerOrProvider) as ERC1155OperatorMock;
  }
}