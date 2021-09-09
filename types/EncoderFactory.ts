/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { Encoder } from "./Encoder";

export class EncoderFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<Encoder> {
    return super.deploy(overrides || {}) as Promise<Encoder>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Encoder {
    return super.attach(address) as Encoder;
  }
  connect(signer: Signer): EncoderFactory {
    return super.connect(signer) as EncoderFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Encoder {
    return new Contract(address, _abi, signerOrProvider) as Encoder;
  }
}

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "currency",
            type: "address",
          },
          {
            internalType: "address[]",
            name: "nftAddressArray",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "loanAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "installmentTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "assetsValue",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "nftTokenIdArray",
            type: "uint256[]",
          },
          {
            internalType: "uint16",
            name: "nrOfInstallments",
            type: "uint16",
          },
          {
            internalType: "uint8[]",
            name: "nftTokenTypeArray",
            type: "uint8[]",
          },
        ],
        internalType:
          "struct DefaultCreateLoanMethod.DefaultCreateLoanMethodParams",
        name: "loan",
        type: "tuple",
      },
    ],
    name: "encodeCreateLoan",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "currency",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "installmentTime",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "nftTokenIdArray",
            type: "uint256[]",
          },
          {
            internalType: "uint256",
            name: "loanAmount",
            type: "uint256",
          },
          {
            internalType: "uint16",
            name: "nrOfInstallments",
            type: "uint16",
          },
        ],
        internalType:
          "struct HealthFactorCreateLoanMethod.HealthFactorCreateLoanMethodParams",
        name: "loan",
        type: "tuple",
      },
    ],
    name: "encodeCreateLoanWithHealth",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "loanId",
        type: "uint256",
      },
    ],
    name: "encodeLackOfPayment",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newLtv",
        type: "uint256",
      },
    ],
    name: "encodeLtvSetter",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "ltv",
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
        name: "newLtv",
        type: "uint256",
      },
    ],
    name: "setLtv",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6080604052600560005534801561001557600080fd5b506107d2806100256000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c80630b43cc1a14610067578063589eb526146100905780636fb49d73146100a3578063a37e52e3146100b8578063c0a7176e146100cb578063d815dc51146100de575b600080fd5b61007a610075366004610525565b6100f1565b60405161008791906105f6565b60405180910390f35b61007a61009e366004610482565b610135565b6100ab610179565b604051610087919061074c565b6100ab6100c6366004610525565b61017f565b61007a6100d936600461038b565b610187565b61007a6100ec366004610525565b6101cb565b606081604051602401610104919061074c565b60408051601f198184030181529190526020810180516001600160e01b03166344ff78c760e01b1790529050919050565b60608160405160240161014891906106f0565b60408051601f198184030181529190526020810180516001600160e01b0316634f23366160e01b1790529050919050565b60005481565b600081905590565b60608160405160240161019a9190610649565b60408051601f198184030181529190526020810180516001600160e01b031663cf92b98360e01b1790529050919050565b6060816040516024016101de919061074c565b60408051601f198184030181529190526020810180516001600160e01b031663a37e52e360e01b1790529050919050565b80356001600160a01b038116811461022657600080fd5b92915050565b600082601f83011261023c578081fd5b813561024f61024a8261077c565b610755565b81815291506020808301908481018184028601820187101561027057600080fd5b60005b8481101561029757610285888361020f565b84529282019290820190600101610273565b505050505092915050565b600082601f8301126102b2578081fd5b81356102c061024a8261077c565b8181529150602080830190848101818402860182018710156102e157600080fd5b60005b84811015610297578135845292820192908201906001016102e4565b600082601f830112610310578081fd5b813561031e61024a8261077c565b81815291506020808301908481018184028601820187101561033f57600080fd5b6000805b8581101561036d57823560ff8116811461035b578283fd5b85529383019391830191600101610343565b50505050505092915050565b803561ffff8116811461022657600080fd5b60006020828403121561039c578081fd5b813567ffffffffffffffff808211156103b3578283fd5b81840191506101008083870312156103c9578384fd5b6103d281610755565b90506103de868461020f565b81526020830135828111156103f1578485fd5b6103fd8782860161022c565b60208301525060408301356040820152606083013560608201526080830135608082015260a083013582811115610432578485fd5b61043e878286016102a2565b60a0830152506104518660c08501610379565b60c082015260e083013582811115610467578485fd5b61047387828601610300565b60e08301525095945050505050565b600060208284031215610493578081fd5b813567ffffffffffffffff808211156104aa578283fd5b9083019060a082860312156104bd578283fd5b6104c760a0610755565b6104d1868461020f565b8152602083013560208201526040830135828111156104ee578485fd5b6104fa878286016102a2565b604083015250606083013560608201526105178660808501610379565b608082015295945050505050565b600060208284031215610536578081fd5b5035919050565b6001600160a01b03169052565b6000815180845260208085019450808401835b838110156105825781516001600160a01b03168752958201959082019060010161055d565b509495945050505050565b6000815180845260208085019450808401835b83811015610582578151875295820195908201906001016105a0565b6000815180845260208085019450808401835b8381101561058257815160ff16875295820195908201906001016105cf565b61ffff169052565b6000602080835283518082850152825b8181101561062257858101830151858201604001528201610606565b818111156106335783604083870101525b50601f01601f1916929092016040019392505050565b60006020825261065d60208301845161053d565b602083015161010080604085015261067961012085018361054a565b91506040850151606085015260608501516080850152608085015160a085015260a0850151601f19808685030160c08701526106b5848361058d565b935060c087015191506106cb60e08701836105ee565b60e08701519150808685030183870152506106e683826105bc565b9695505050505050565b60006020825260018060a01b03835116602083015260208301516040830152604083015160a0606084015261072860c084018261058d565b90506060840151608084015261ffff60808501511660a08401528091505092915050565b90815260200190565b60405181810167ffffffffffffffff8111828210171561077457600080fd5b604052919050565b600067ffffffffffffffff821115610792578081fd5b506020908102019056fea2646970667358221220701a84cd33306768148e4359d5ae597157efb91149cdcc6467725baeff6c481264736f6c634300060c0033";
