/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  PayableOverrides,
  BytesLike,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  UpgradeableProxy,
  UpgradeableProxyInterface,
} from "../UpgradeableProxy";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_logic",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x60806040526040516103dd3803806103dd8339818101604052604081101561002657600080fd5b81019080805190602001909291908051604051939291908464010000000082111561005057600080fd5b8382019150602082018581111561006657600080fd5b825186600182028301116401000000008211171561008357600080fd5b8083526020830192505050908051906020019080838360005b838110156100b757808201518184015260208101905061009c565b50505050905090810190601f1680156100e45780820380516001836020036101000a031916815260200191505b5060405250505060017f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbd60001c0360001b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b1461014057fe5b61014f8261022260201b60201c565b60008151111561021b5760008273ffffffffffffffffffffffffffffffffffffffff16826040518082805190602001908083835b602083106101a65780518252602082019150602081019050602083039250610183565b6001836020036101000a038019825116818451168082178552505050505050905001915050600060405180830381855af49150503d8060008114610206576040519150601f19603f3d011682016040523d82523d6000602084013e61020b565b606091505b505090508061021957600080fd5b505b50506102cc565b610235816102b960201b61002c1760201c565b61028a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260368152602001806103a76036913960400191505060405180910390fd5b60007f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b90508181555050565b600080823b905060008111915050919050565b60cd806102da6000396000f3fe608060405236601057600e6018565b005b60166018565b005b601e603f565b602a60266041565b6072565b565b600080823b905060008111915050919050565b565b6000807f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b9050805491505090565b3660008037600080366000845af43d6000803e80600081146092573d6000f35b3d6000fdfea2646970667358221220862f3a3a44a8b30d1cc0fae4a46a7e494c5d11a8f4a9b13e8692df50e6e8348d64736f6c634300070600335570677261646561626c6550726f78793a206e657720696d706c656d656e746174696f6e206973206e6f74206120636f6e7472616374";

type UpgradeableProxyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: UpgradeableProxyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class UpgradeableProxy__factory extends ContractFactory {
  constructor(...args: UpgradeableProxyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "UpgradeableProxy";
  }

  deploy(
    _logic: string,
    _data: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<UpgradeableProxy> {
    return super.deploy(
      _logic,
      _data,
      overrides || {}
    ) as Promise<UpgradeableProxy>;
  }
  getDeployTransaction(
    _logic: string,
    _data: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_logic, _data, overrides || {});
  }
  attach(address: string): UpgradeableProxy {
    return super.attach(address) as UpgradeableProxy;
  }
  connect(signer: Signer): UpgradeableProxy__factory {
    return super.connect(signer) as UpgradeableProxy__factory;
  }
  static readonly contractName: "UpgradeableProxy";
  public readonly contractName: "UpgradeableProxy";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): UpgradeableProxyInterface {
    return new utils.Interface(_abi) as UpgradeableProxyInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): UpgradeableProxy {
    return new Contract(address, _abi, signerOrProvider) as UpgradeableProxy;
  }
}
