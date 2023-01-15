/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  Overrides,
  BytesLike,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ERC1271WalletValidationMock,
  ERC1271WalletValidationMockInterface,
} from "../ERC1271WalletValidationMock";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "domain_hash_1155",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ERC1271_INVALID",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ERC1271_MAGICVALUE_BYTES32",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ERC1271_MAGIC_VAL",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_hash",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "_signature",
        type: "bytes",
      },
    ],
    name: "isValidSignature",
    outputs: [
      {
        internalType: "bytes4",
        name: "magicValue",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "_signature",
        type: "bytes",
      },
    ],
    name: "isValidSignature",
    outputs: [
      {
        internalType: "bytes4",
        name: "magicValue",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
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
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_values",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
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
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506040516111f33803806111f38339818101604052602081101561003357600080fd5b810190808051906020019092919050505080806000819055505033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550506111558061009e6000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c80638da5cb5b1161005b5780638da5cb5b146102be578063a886100f146102f2578063bc197c811461032f578063f23a6e611461058557610088565b80630c0b5b8b1461008d5780631626ba7e146100ca57806320c13b0b146101805780632ec40aa414610281575b600080fd5b6100956106c7565b60405180827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b61014b600480360360408110156100e057600080fd5b81019080803590602001909291908035906020019064010000000081111561010757600080fd5b82018360208201111561011957600080fd5b8035906020019184600183028401116401000000008311171561013b57600080fd5b90919293919293905050506106d2565b60405180827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b61024c6004803603604081101561019657600080fd5b81019080803590602001906401000000008111156101b357600080fd5b8201836020820111156101c557600080fd5b803590602001918460018302840111640100000000831117156101e757600080fd5b90919293919293908035906020019064010000000081111561020857600080fd5b82018360208201111561021a57600080fd5b8035906020019184600183028401116401000000008311171561023c57600080fd5b90919293919293905050506108d7565b60405180827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b610289610d2a565b60405180827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b6102c6610d35565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6102fa610d5b565b60405180827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b610550600480360360a081101561034557600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156103a257600080fd5b8201836020820111156103b457600080fd5b803590602001918460208302840111640100000000831117156103d657600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561043657600080fd5b82018360208201111561044857600080fd5b8035906020019184602083028401116401000000008311171561046a57600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156104ca57600080fd5b8201836020820111156104dc57600080fd5b803590602001918460018302840111640100000000831117156104fe57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610d66565b60405180827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b610692600480360360a081101561059b57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190803590602001909291908035906020019064010000000081111561060c57600080fd5b82018360208201111561061e57600080fd5b8035906020019184600183028401116401000000008311171561064057600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610d7b565b60405180827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b6320c13b0b60e01b81565b60008061072d600085858080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050610d9090919063ffffffff16565b90506000610789602086868080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050610d9090919063ffffffff16565b905060008585604081811061079a57fe5b9050013560f81c60f81b60f81c9050600060018860405160200180807f19457468657265756d205369676e6564204d6573736167653a0a333200000000815250601c018281526020019150506040516020818303038152906040528051906020012083868660405160008152602001604052604051808581526020018460ff1681526020018381526020018281526020019450505050506020604051602081039080840390855afa158015610853573d6000803e3d6000fd5b5050506020604051035190508073ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16146108c15763deadbeef60e01b6108ca565b631626ba7e60e01b5b9450505050509392505050565b600080610932600087878080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050610d9090919063ffffffff16565b905060006060807fce0b514b3931bdbe4d5d44e4f035afe7113767b7db71949271f6a62d9c60f55860001b841415610afe576109b589898080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050600060e0610e01565b915060006109cd606084610d9090919063ffffffff16565b60001c905060006109e8608085610d9090919063ffffffff16565b60001c90506042821415806109fd5750606481115b15610a175763deadbeef60e01b9650505050505050610d22565b610a6a8b8b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505060e08d8d9050610e01565b9250610af58484805190602001206040516020018083805190602001908083835b60208310610aae5780518252602082019150602081019050602083039250610a8b565b6001836020036101000a0380198251168184511680821785525050505050509050018281526020019250505060405160208183030381529060405280519060200120610f64565b94505050610b20565b8888604051808383808284378083019250505092505050604051809103902092505b6000610b7a600089898080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050610d9090919063ffffffff16565b90506000610bd660208a8a8080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050610d9090919063ffffffff16565b9050600089896040818110610be757fe5b9050013560f81c60f81b60f81c9050600060018760405160200180807f19457468657265756d205369676e6564204d6573736167653a0a333200000000815250601c018281526020019150506040516020818303038152906040528051906020012083868660405160008152602001604052604051808581526020018460ff1681526020018381526020018281526020019450505050506020604051602081039080840390855afa158015610ca0573d6000803e3d6000fd5b5050506020604051035190508073ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610d0e5763deadbeef60e01b610d17565b6320c13b0b60e01b5b985050505050505050505b949350505050565b631626ba7e60e01b81565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b63deadbeef60e01b81565b600063bc197c8160e01b905095945050505050565b600063f23a6e6160e01b905095945050505050565b60006020820183511015610def576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252603c8152602001806110e4603c913960400191505060405180910390fd5b60208201915081830151905092915050565b606081831115610e79576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601e8152602001807f4552433132373157616c6c65744d6f636b23736c6963653a204572726f72000081525060200191505060405180910390fd5b8351821115610ef0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601e8152602001807f4552433132373157616c6c65744d6f636b23736c6963653a204572726f72000081525060200191505060405180910390fd5b82820367ffffffffffffffff81118015610f0957600080fd5b506040519080825280601f01601f191660200182016040528015610f3c5781602001600182028036833780820191505090505b509050610f5d610f4b82611026565b84610f5587611026565b018351611033565b9392505050565b60006040518060400160405280600281526020017f1901000000000000000000000000000000000000000000000000000000000000815250600054836040516020018084805190602001908083835b60208310610fd65780518252602082019150602081019050602083039250610fb3565b6001836020036101000a0380198251168184511680821785525050505050509050018381526020018281526020019350505050604051602081830303815290604052805190602001209050919050565b6000602082019050919050565b602081101561105d576001816020036101000a0380198351168185511680821786525050506110dd565b8282141561106a576110de565b828211156110a95760208103905080820181840181515b8285101561109e5784518652602085019450602086019550611081565b8082525050506110dc565b60208103905080820181840183515b818612156110d557825182526020830392506020820391506110b8565b8086525050505b5b5b50505056fe4c696242797465732372656164427974657333323a20475245415445525f4f525f455155414c5f544f5f33325f4c454e4754485f5245515549524544a26469706673582212208a561395437ebef7ed9a9cca5a1cb7ffc53ff576c45eaa791ce1eb52a62a452164736f6c63430007060033";

type ERC1271WalletValidationMockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC1271WalletValidationMockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC1271WalletValidationMock__factory extends ContractFactory {
  constructor(...args: ERC1271WalletValidationMockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "ERC1271WalletValidationMock";
  }

  deploy(
    domain_hash_1155: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ERC1271WalletValidationMock> {
    return super.deploy(
      domain_hash_1155,
      overrides || {}
    ) as Promise<ERC1271WalletValidationMock>;
  }
  getDeployTransaction(
    domain_hash_1155: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(domain_hash_1155, overrides || {});
  }
  attach(address: string): ERC1271WalletValidationMock {
    return super.attach(address) as ERC1271WalletValidationMock;
  }
  connect(signer: Signer): ERC1271WalletValidationMock__factory {
    return super.connect(signer) as ERC1271WalletValidationMock__factory;
  }
  static readonly contractName: "ERC1271WalletValidationMock";
  public readonly contractName: "ERC1271WalletValidationMock";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC1271WalletValidationMockInterface {
    return new utils.Interface(_abi) as ERC1271WalletValidationMockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC1271WalletValidationMock {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ERC1271WalletValidationMock;
  }
}
