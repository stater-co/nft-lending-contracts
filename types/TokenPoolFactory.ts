/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { TokenPool } from "./TokenPool";

export class TokenPoolFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(_token: string, overrides?: Overrides): Promise<TokenPool> {
    return super.deploy(_token, overrides || {}) as Promise<TokenPool>;
  }
  getDeployTransaction(
    _token: string,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(_token, overrides || {});
  }
  attach(address: string): TokenPool {
    return super.attach(address) as TokenPool;
  }
  connect(signer: Signer): TokenPoolFactory {
    return super.connect(signer) as TokenPoolFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TokenPool {
    return new Contract(address, _abi, signerOrProvider) as TokenPool;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_token",
        type: "address",
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
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "balance",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenToRescue",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "rescueFunds",
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
    name: "token",
    outputs: [
      {
        internalType: "contract IERC20",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
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
  "0x608060405234801561001057600080fd5b5060405161072a38038061072a8339818101604052602081101561003357600080fd5b5051600061003f6100ae565b600080546001600160a01b0319166001600160a01b0383169081178255604051929350917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a350600180546001600160a01b0319166001600160a01b03929092169190911790556100b2565b3390565b610669806100c16000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063a9059cbb1161005b578063a9059cbb146100fa578063b69ef8a814610126578063f2fde38b14610140578063fc0c546a146101665761007d565b80636ccae05414610082578063715018a6146100cc5780638da5cb5b146100d6575b600080fd5b6100b86004803603606081101561009857600080fd5b506001600160a01b0381358116916020810135909116906040013561016e565b604080519115158252519081900360200190f35b6100d46102a0565b005b6100de610342565b604080516001600160a01b039092168252519081900360200190f35b6100b86004803603604081101561011057600080fd5b506001600160a01b038135169060200135610351565b61012e610434565b60408051918252519081900360200190f35b6100d46004803603602081101561015657600080fd5b50356001600160a01b03166104b0565b6100de6105a8565b60006101786105b7565b6000546001600160a01b039081169116146101c8576040805162461bcd60e51b815260206004820181905260248201526000805160206105e2833981519152604482015290519081900360640190fd5b6001546001600160a01b03858116911614156102155760405162461bcd60e51b81526004018080602001828103825260328152602001806106026032913960400191505060405180910390fd5b836001600160a01b031663a9059cbb84846040518363ffffffff1660e01b815260040180836001600160a01b0316815260200182815260200192505050602060405180830381600087803b15801561026c57600080fd5b505af1158015610280573d6000803e3d6000fd5b505050506040513d602081101561029657600080fd5b5051949350505050565b6102a86105b7565b6000546001600160a01b039081169116146102f8576040805162461bcd60e51b815260206004820181905260248201526000805160206105e2833981519152604482015290519081900360640190fd5b600080546040516001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a3600080546001600160a01b0319169055565b6000546001600160a01b031690565b600061035b6105b7565b6000546001600160a01b039081169116146103ab576040805162461bcd60e51b815260206004820181905260248201526000805160206105e2833981519152604482015290519081900360640190fd5b6001546040805163a9059cbb60e01b81526001600160a01b038681166004830152602482018690529151919092169163a9059cbb9160448083019260209291908290030181600087803b15801561040157600080fd5b505af1158015610415573d6000803e3d6000fd5b505050506040513d602081101561042b57600080fd5b50519392505050565b600154604080516370a0823160e01b815230600482015290516000926001600160a01b0316916370a08231916024808301926020929190829003018186803b15801561047f57600080fd5b505afa158015610493573d6000803e3d6000fd5b505050506040513d60208110156104a957600080fd5b5051905090565b6104b86105b7565b6000546001600160a01b03908116911614610508576040805162461bcd60e51b815260206004820181905260248201526000805160206105e2833981519152604482015290519081900360640190fd5b6001600160a01b03811661054d5760405162461bcd60e51b81526004018080602001828103825260268152602001806105bc6026913960400191505060405180910390fd5b600080546040516001600160a01b03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a3600080546001600160a01b0319166001600160a01b0392909216919091179055565b6001546001600160a01b031681565b339056fe4f776e61626c653a206e6577206f776e657220697320746865207a65726f20616464726573734f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572546f6b656e506f6f6c3a2043616e6e6f7420636c61696d20746f6b656e2068656c642062792074686520636f6e7472616374a2646970667358221220049fe048bb8e5d400db9f34f8318183e5542446aeb062e6aa61c2ad6044d5deb64736f6c634300060c0033";
