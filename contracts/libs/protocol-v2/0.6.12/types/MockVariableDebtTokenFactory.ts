/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { MockVariableDebtToken } from "./MockVariableDebtToken";

export class MockVariableDebtTokenFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<MockVariableDebtToken> {
    return super.deploy(overrides || {}) as Promise<MockVariableDebtToken>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): MockVariableDebtToken {
    return super.attach(address) as MockVariableDebtToken;
  }
  connect(signer: Signer): MockVariableDebtTokenFactory {
    return super.connect(signer) as MockVariableDebtTokenFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockVariableDebtToken {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as MockVariableDebtToken;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
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
        name: "fromUser",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "toUser",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "BorrowAllowanceDelegated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
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
        name: "underlyingAsset",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "incentivesController",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "debtTokenDecimals",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "string",
        name: "debtTokenName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "debtTokenSymbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "params",
        type: "bytes",
      },
    ],
    name: "Initialized",
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
        name: "onBehalfOf",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "Mint",
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
    inputs: [],
    name: "DEBT_TOKEN_REVISION",
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
    inputs: [],
    name: "POOL",
    outputs: [
      {
        internalType: "contract ILendingPool",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UNDERLYING_ASSET_ADDRESS",
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
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
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
        name: "delegatee",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approveDelegation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
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
        internalType: "address",
        name: "fromUser",
        type: "address",
      },
      {
        internalType: "address",
        name: "toUser",
        type: "address",
      },
    ],
    name: "borrowAllowance",
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
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
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
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getIncentivesController",
    outputs: [
      {
        internalType: "contract IAaveIncentivesController",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getScaledUserBalanceAndSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ILendingPool",
        name: "pool",
        type: "address",
      },
      {
        internalType: "address",
        name: "underlyingAsset",
        type: "address",
      },
      {
        internalType: "contract IAaveIncentivesController",
        name: "incentivesController",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "debtTokenDecimals",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "debtTokenName",
        type: "string",
      },
      {
        internalType: "string",
        name: "debtTokenSymbol",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "params",
        type: "bytes",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
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
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "scaledBalanceOf",
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
    inputs: [],
    name: "scaledTotalSupply",
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
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
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
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405260006006553480156200001657600080fd5b50604080518082018252600e8082526d111150951513d2d15397d253541360921b60208084018281528551808701909652928552840152815191929160009162000064916003919062000098565b5081516200007a90600490602085019062000098565b506005805460ff191660ff9290921691909117905550620001349050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620000db57805160ff19168380011785556200010b565b828001600101855582156200010b579182015b828111156200010b578251825591602001919060010190620000ee565b50620001199291506200011d565b5090565b5b808211156200011957600081556001016200011e565b6117c780620001446000396000f3fe608060405234801561001057600080fd5b506004361061014d5760003560e01c806375d26413116100c3578063b3f1c93d1161007c578063b3f1c93d146103d2578063b9a7b6221461040e578063c04a8a1014610416578063c222ec8a14610444578063dd62ed3e146105ed578063f5298aca1461061b5761014d565b806375d264131461038657806395d89b411461038e578063a457c2d7146102e2578063a9059cbb14610396578063b16a19de146103c2578063b1bf962d146103ca5761014d565b806323b872dd1161011557806323b872dd1461028e578063313ce567146102c457806339509351146102e25780636bd76d241461030e57806370a082311461033c5780637535d246146103625761014d565b806306fdde0314610152578063095ea7b3146101cf5780630afbcdc91461020f57806318160ddd1461024e5780631da24f3e14610268575b600080fd5b61015a61064d565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561019457818101518382015260200161017c565b50505050905090810190601f1680156101c15780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101fb600480360360408110156101e557600080fd5b506001600160a01b0381351690602001356106e3565b604080519115158252519081900360200190f35b6102356004803603602081101561022557600080fd5b50356001600160a01b031661072b565b6040805192835260208301919091528051918290030190f35b610256610748565b60408051918252519081900360200190f35b6102566004803603602081101561027e57600080fd5b50356001600160a01b03166107db565b6101fb600480360360608110156102a457600080fd5b506001600160a01b038135811691602081013590911690604001356107ee565b6102cc610836565b6040805160ff9092168252519081900360200190f35b6101fb600480360360408110156102f857600080fd5b506001600160a01b03813516906020013561083f565b6102566004803603604081101561032457600080fd5b506001600160a01b038135811691602001351661088e565b6102566004803603602081101561035257600080fd5b50356001600160a01b03166108bb565b61036a610967565b604080516001600160a01b039092168252519081900360200190f35b61036a610976565b61015a610980565b6101fb600480360360408110156103ac57600080fd5b506001600160a01b0381351690602001356107ee565b61036a6109e1565b6102566109f0565b6101fb600480360360808110156103e857600080fd5b506001600160a01b038135811691602081013590911690604081013590606001356109fa565b610256610c13565b6104426004803603604081101561042c57600080fd5b506001600160a01b038135169060200135610c18565b005b610442600480360360e081101561045a57600080fd5b6001600160a01b038235811692602081013582169260408201359092169160ff606083013516919081019060a0810160808201356401000000008111156104a057600080fd5b8201836020820111156104b257600080fd5b803590602001918460018302840111640100000000831117156104d457600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929594936020810193503591505064010000000081111561052757600080fd5b82018360208201111561053957600080fd5b8035906020019184600183028401116401000000008311171561055b57600080fd5b91908080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092959493602081019350359150506401000000008111156105ae57600080fd5b8201836020820111156105c057600080fd5b803590602001918460018302840111640100000000831117156105e257600080fd5b509092509050610cb4565b6102566004803603604081101561060357600080fd5b506001600160a01b038135811691602001351661083f565b6104426004803603606081101561063157600080fd5b506001600160a01b038135169060208101359060400135610f03565b60038054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156106d95780601f106106ae576101008083540402835291602001916106d9565b820191906000526020600020905b8154815290600101906020018083116106bc57829003601f168201915b5050505050905090565b6040805162461bcd60e51b81526020600482015260166024820152751054141493d5905317d393d517d4d5541413d495115160521b6044820152905160009181900360640190fd5b60008061073783611097565b61073f6110b2565b91509150915091565b603b54603c546040805163386497fd60e01b81526001600160a01b03928316600482015290516000936107d693169163386497fd916024808301926020929190829003018186803b15801561079c57600080fd5b505afa1580156107b0573d6000803e3d6000fd5b505050506040513d60208110156107c657600080fd5b50516107d06110b2565b906110b8565b905090565b60006107e682611097565b90505b919050565b6040805162461bcd60e51b81526020600482015260166024820152751514905394d1915497d393d517d4d5541413d495115160521b6044820152905160009181900360640190fd5b60055460ff1690565b6040805162461bcd60e51b815260206004820152601760248201527f414c4c4f57414e43455f4e4f545f535550504f525445440000000000000000006044820152905160009181900360640190fd5b6001600160a01b038083166000908152603a60209081526040808320938516835292905220545b92915050565b6000806108c783611097565b9050806108d85760009150506107e9565b603b54603c546040805163386497fd60e01b81526001600160a01b039283166004820152905161096093929092169163386497fd91602480820192602092909190829003018186803b15801561092d57600080fd5b505afa158015610941573d6000803e3d6000fd5b505050506040513d602081101561095757600080fd5b505182906110b8565b9392505050565b603b546001600160a01b031690565b60006107d6611176565b60048054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156106d95780601f106106ae576101008083540402835291602001916106d9565b603c546001600160a01b031690565b60006107d66110b2565b6000610a04610967565b6001600160a01b0316610a15611185565b6001600160a01b03161460405180604001604052806002815260200161323960f01b81525090610ac35760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b83811015610a88578181015183820152602001610a70565b50505050905090810190601f168015610ab55780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b50836001600160a01b0316856001600160a01b031614610ae857610ae8848685611189565b6000610af385611097565b90506000610b018585611251565b6040805180820190915260028152611a9b60f11b602082015290915081610b695760405162461bcd60e51b8152602060048201818152835160248401528351909283926044909101919085019080838360008315610a88578181015183820152602001610a70565b50610b748682611358565b6040805186815290516001600160a01b038816916000917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9181900360200190a3856001600160a01b0316876001600160a01b03167f2f00e3cdd69a77be7ed215ec7b2a36784dd158f921fca79ac29deffa353fe6ee8787604051808381526020018281526020019250505060405180910390a3501595945050505050565b600181565b80603a6000610c25611185565b6001600160a01b0390811682526020808301939093526040918201600090812091871680825291909352912091909155610c5d611185565b6001600160a01b03167fda919360433220e13b51e8c211e490d148e61a3bd53de8c097194e458b97f3e1610c8f6109e1565b604080516001600160a01b039092168252602082018690528051918290030190a35050565b6000610cbe6114a9565b60075490915060ff1680610cd55750610cd56114ae565b80610ce1575060065481115b610d1c5760405162461bcd60e51b815260040180806020018281038252602e815260200180611743602e913960400191505060405180910390fd5b60075460ff16158015610d3c576007805460ff1916600117905560068290555b610d45866114b4565b610d4e856114cb565b610d57876114de565b603b80546001600160a01b03808d166001600160a01b03199283168117909355603c80548d83169084168117909155603d8054928d169290931682179092556040805191825260ff8b1660208084019190915260a09183018281528b51928401929092528a517f40251fbfb6656cfa65a00d7879029fec1fad21d28fdcff2f4f68f52795b74f2c938e938e938e938e938e938e93919290916060840191608085019160c0860191908a019080838360005b83811015610e20578181015183820152602001610e08565b50505050905090810190601f168015610e4d5780820380516001836020036101000a031916815260200191505b50848103835287518152875160209182019189019080838360005b83811015610e80578181015183820152602001610e68565b50505050905090810190601f168015610ead5780820380516001836020036101000a031916815260200191505b508481038252858152602001868680828437600083820152604051601f909101601f19169092018290039b50909950505050505050505050a38015610ef7576007805460ff191690555b50505050505050505050565b610f0b610967565b6001600160a01b0316610f1c611185565b6001600160a01b03161460405180604001604052806002815260200161323960f01b81525090610f8d5760405162461bcd60e51b8152602060048201818152835160248401528351909283926044909101919085019080838360008315610a88578181015183820152602001610a70565b506000610f9a8383611251565b60408051808201909152600281526106a760f31b6020820152909150816110025760405162461bcd60e51b8152602060048201818152835160248401528351909283926044909101919085019080838360008315610a88578181015183820152602001610a70565b5061100d84826114f4565b6040805184815290516000916001600160a01b038716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9181900360200190a3604080518481526020810184905281516001600160a01b038716927f49995e5dd6158cf69ad3e9777c46755a1a826a446c6416992167462dad033b2a928290030190a250505050565b6001600160a01b031660009081526020819052604090205490565b60025490565b60008215806110c5575081155b156110d2575060006108b5565b816b019d971e4fe8401e7400000019816110e857fe5b0483111560405180604001604052806002815260200161068760f31b815250906111535760405162461bcd60e51b8152602060048201818152835160248401528351909283926044909101919085019080838360008315610a88578181015183820152602001610a70565b50506b033b2e3c9fd0803ce800000091026b019d971e4fe8401e74000000010490565b603d546001600160a01b031690565b3390565b6040805180820182526002815261353960f01b6020808301919091526001600160a01b038087166000908152603a835284812091871681529152918220546111d2918490611592565b6001600160a01b038086166000818152603a60209081526040808320948916808452949091529020839055919250907fda919360433220e13b51e8c211e490d148e61a3bd53de8c097194e458b97f3e161122a6109e1565b604080516001600160a01b039092168252602082018690528051918290030190a350505050565b604080518082019091526002815261035360f41b6020820152600090826112b95760405162461bcd60e51b8152602060048201818152835160248401528351909283926044909101919085019080838360008315610a88578181015183820152602001610a70565b5060408051808201909152600280825261068760f31b60208301528304906b033b2e3c9fd0803ce80000008219048511156113355760405162461bcd60e51b8152602060048201818152835160248401528351909283926044909101919085019080838360008315610a88578181015183820152602001610a70565b5082816b033b2e3c9fd0803ce80000008602018161134f57fe5b04949350505050565b6001600160a01b0382166113b3576040805162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015290519081900360640190fd5b6113bf600083836115ec565b6002546113cc81836115f1565b6002556001600160a01b0383166000908152602081905260409020546113f281846115f1565b6001600160a01b038516600090815260208190526040812091909155611416611176565b6001600160a01b0316146114a35761142c611176565b6001600160a01b03166331873e2e8584846040518463ffffffff1660e01b815260040180846001600160a01b031681526020018381526020018281526020019350505050600060405180830381600087803b15801561148a57600080fd5b505af115801561149e573d6000803e3d6000fd5b505050505b50505050565b600290565b303b1590565b80516114c790600390602084019061168d565b5050565b80516114c790600490602084019061168d565b6005805460ff191660ff92909216919091179055565b6001600160a01b0382166115395760405162461bcd60e51b81526004018080602001828103825260218152602001806117716021913960400191505060405180910390fd5b611545826000836115ec565b600254611552818361164b565b6002556001600160a01b0383166000908152602081815260409182902054825160608101909352602280845290926113f292869290611721908301398391905b600081848411156115e45760405162461bcd60e51b8152602060048201818152835160248401528351909283926044909101919085019080838360008315610a88578181015183820152602001610a70565b505050900390565b505050565b600082820183811015610960576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b600061096083836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f770000815250611592565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106116ce57805160ff19168380011785556116fb565b828001600101855582156116fb579182015b828111156116fb5782518255916020019190600101906116e0565b5061170792915061170b565b5090565b5b80821115611707576000815560010161170c56fe45524332303a206275726e20616d6f756e7420657863656564732062616c616e6365436f6e747261637420696e7374616e63652068617320616c7265616479206265656e20696e697469616c697a656445524332303a206275726e2066726f6d20746865207a65726f2061646472657373a26469706673582212204114dbd0f92e3dafe9c7e1baf5409c7937089f52cdab426d3466e270fbba19d464736f6c634300060c0033";
