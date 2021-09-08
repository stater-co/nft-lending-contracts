/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { MintableDelegationERC20 } from "./MintableDelegationERC20";

export class MintableDelegationERC20Factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    name: string,
    symbol: string,
    decimals: BigNumberish,
    overrides?: Overrides
  ): Promise<MintableDelegationERC20> {
    return super.deploy(
      name,
      symbol,
      decimals,
      overrides || {}
    ) as Promise<MintableDelegationERC20>;
  }
  getDeployTransaction(
    name: string,
    symbol: string,
    decimals: BigNumberish,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(name, symbol, decimals, overrides || {});
  }
  attach(address: string): MintableDelegationERC20 {
    return super.attach(address) as MintableDelegationERC20;
  }
  connect(signer: Signer): MintableDelegationERC20Factory {
    return super.connect(signer) as MintableDelegationERC20Factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MintableDelegationERC20 {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as MintableDelegationERC20;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "decimals",
        type: "uint8",
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
        name: "account",
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
    inputs: [
      {
        internalType: "address",
        name: "delegateeAddress",
        type: "address",
      },
    ],
    name: "delegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "delegatee",
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
        internalType: "uint256",
        name: "value",
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
  "0x60806040523480156200001157600080fd5b5060405162000e9538038062000e95833981810160405260608110156200003757600080fd5b81019080805160405193929190846401000000008211156200005857600080fd5b9083019060208201858111156200006e57600080fd5b82516401000000008111828201881017156200008957600080fd5b82525081516020918201929091019080838360005b83811015620000b85781810151838201526020016200009e565b50505050905090810190601f168015620000e65780820380516001836020036101000a031916815260200191505b50604052602001805160405193929190846401000000008211156200010a57600080fd5b9083019060208201858111156200012057600080fd5b82516401000000008111828201881017156200013b57600080fd5b82525081516020918201929091019080838360005b838110156200016a57818101518382015260200162000150565b50505050905090810190601f168015620001985780820380516001836020036101000a031916815260200191505b5060405260209081015185519093508592508491620001bd916003918501906200020d565b508051620001d39060049060208401906200020d565b50506005805460ff1916601217905550620001ee81620001f7565b505050620002a9565b6005805460ff191660ff92909216919091179055565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200025057805160ff191683800117855562000280565b8280016001018555821562000280579182015b828111156200028057825182559160200191906001019062000263565b506200028e92915062000292565b5090565b5b808211156200028e576000815560010162000293565b610bdc80620002b96000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c80635c19a95c1161008c578063a0712d6811610066578063a0712d68146102c0578063a457c2d7146102dd578063a9059cbb14610309578063dd62ed3e14610335576100ea565b80635c19a95c1461026a57806370a082311461029257806395d89b41146102b8576100ea565b80631e31d053116100c85780631e31d053146101c657806323b872dd146101ea578063313ce56714610220578063395093511461023e576100ea565b806306fdde03146100ef578063095ea7b31461016c57806318160ddd146101ac575b600080fd5b6100f7610363565b6040805160208082528351818301528351919283929083019185019080838360005b83811015610131578181015183820152602001610119565b50505050905090810190601f16801561015e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101986004803603604081101561018257600080fd5b506001600160a01b0381351690602001356103f9565b604080519115158252519081900360200190f35b6101b4610416565b60408051918252519081900360200190f35b6101ce61041c565b604080516001600160a01b039092168252519081900360200190f35b6101986004803603606081101561020057600080fd5b506001600160a01b03813581169160208101359091169060400135610430565b6102286104b7565b6040805160ff9092168252519081900360200190f35b6101986004803603604081101561025457600080fd5b506001600160a01b0381351690602001356104c0565b6102906004803603602081101561028057600080fd5b50356001600160a01b031661050e565b005b6101b4600480360360208110156102a857600080fd5b50356001600160a01b0316610536565b6100f7610551565b610198600480360360208110156102d657600080fd5b50356105b2565b610198600480360360408110156102f357600080fd5b506001600160a01b0381351690602001356105c6565b6101986004803603604081101561031f57600080fd5b506001600160a01b03813516906020013561062e565b6101b46004803603604081101561034b57600080fd5b506001600160a01b0381358116916020013516610642565b60038054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156103ef5780601f106103c4576101008083540402835291602001916103ef565b820191906000526020600020905b8154815290600101906020018083116103d257829003601f168201915b5050505050905090565b600061040d61040661066d565b8484610671565b50600192915050565b60025490565b60055461010090046001600160a01b031681565b600061043d84848461075d565b6104ad8461044961066d565b6104a885604051806060016040528060288152602001610b11602891396001600160a01b038a1660009081526001602052604081209061048761066d565b6001600160a01b0316815260208101919091526040016000205491906108b8565b610671565b5060019392505050565b60055460ff1690565b600061040d6104cd61066d565b846104a885600160006104de61066d565b6001600160a01b03908116825260208083019390935260409182016000908120918c16815292529020549061094f565b600580546001600160a01b0390921661010002610100600160a81b0319909216919091179055565b6001600160a01b031660009081526020819052604090205490565b60048054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156103ef5780601f106103c4576101008083540402835291602001916103ef565b60006105be33836109b0565b506001919050565b600061040d6105d361066d565b846104a885604051806060016040528060258152602001610b8260259139600160006105fd61066d565b6001600160a01b03908116825260208083019390935260409182016000908120918d168152925290205491906108b8565b600061040d61063b61066d565b848461075d565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b3390565b6001600160a01b0383166106b65760405162461bcd60e51b8152600401808060200182810382526024815260200180610b5e6024913960400191505060405180910390fd5b6001600160a01b0382166106fb5760405162461bcd60e51b8152600401808060200182810382526022815260200180610ac96022913960400191505060405180910390fd5b6001600160a01b03808416600081815260016020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b6001600160a01b0383166107a25760405162461bcd60e51b8152600401808060200182810382526025815260200180610b396025913960400191505060405180910390fd5b6001600160a01b0382166107e75760405162461bcd60e51b8152600401808060200182810382526023815260200180610aa66023913960400191505060405180910390fd5b6107f2838383610aa0565b61082f81604051806060016040528060268152602001610aeb602691396001600160a01b03861660009081526020819052604090205491906108b8565b6001600160a01b03808516600090815260208190526040808220939093559084168152205461085e908261094f565b6001600160a01b038084166000818152602081815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b600081848411156109475760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b8381101561090c5781810151838201526020016108f4565b50505050905090810190601f1680156109395780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b505050900390565b6000828201838110156109a9576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b9392505050565b6001600160a01b038216610a0b576040805162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015290519081900360640190fd5b610a1760008383610aa0565b600254610a24908261094f565b6002556001600160a01b038216600090815260208190526040902054610a4a908261094f565b6001600160a01b0383166000818152602081815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35050565b50505056fe45524332303a207472616e7366657220746f20746865207a65726f206164647265737345524332303a20617070726f766520746f20746865207a65726f206164647265737345524332303a207472616e7366657220616d6f756e7420657863656564732062616c616e636545524332303a207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e636545524332303a207472616e736665722066726f6d20746865207a65726f206164647265737345524332303a20617070726f76652066726f6d20746865207a65726f206164647265737345524332303a2064656372656173656420616c6c6f77616e63652062656c6f77207a65726fa26469706673582212208022bd8ff90cd473b6e54da9348d7778ba84b32436cce5e09a629be3072f896b64736f6c634300060c0033";
