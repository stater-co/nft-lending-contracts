/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { WalletBalanceProvider } from "./WalletBalanceProvider";

export class WalletBalanceProviderFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<WalletBalanceProvider> {
    return super.deploy(overrides || {}) as Promise<WalletBalanceProvider>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): WalletBalanceProvider {
    return super.attach(address) as WalletBalanceProvider;
  }
  connect(signer: Signer): WalletBalanceProviderFactory {
    return super.connect(signer) as WalletBalanceProviderFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): WalletBalanceProvider {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as WalletBalanceProvider;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
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
        internalType: "address[]",
        name: "users",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
    ],
    name: "batchBalanceOf",
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
        name: "provider",
        type: "address",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserWalletBalances",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
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
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610a63806100206000396000f3fe6080604052600436106100385760003560e01c80630240534314610072578063b59b28ef146100a9578063f7888aec146100d65761006d565b3661006d5761004633610103565b61006b5760405162461bcd60e51b8152600401610062906109c9565b60405180910390fd5b005b600080fd5b34801561007e57600080fd5b5061009261008d366004610758565b61013f565b6040516100a092919061092f565b60405180910390f35b3480156100b557600080fd5b506100c96100c4366004610790565b6104b1565b6040516100a0919061098f565b3480156100e257600080fd5b506100f66100f1366004610758565b61058d565b6040516100a091906109e5565b6000813f7fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a47081811480159061013757508115155b949350505050565b6060806000846001600160a01b0316630261bf8b6040518163ffffffff1660e01b815260040160206040518083038186803b15801561017d57600080fd5b505afa158015610191573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101b5919061073c565b90506060816001600160a01b031663d1946dbc6040518163ffffffff1660e01b815260040160006040518083038186803b1580156101f257600080fd5b505afa158015610206573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261022e91908101906107f9565b90506060815160010167ffffffffffffffff8111801561024d57600080fd5b50604051908082528060200260200182016040528015610277578160200160208202803683370190505b50905060005b82518110156102c65782818151811061029257fe5b60200260200101518282815181106102a657fe5b6001600160a01b039092166020928302919091019091015260010161027d565b5073eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee818351815181106102e957fe5b60200260200101906001600160a01b031690816001600160a01b0316815250506060815167ffffffffffffffff8111801561032357600080fd5b5060405190808252806020026020018201604052801561034d578160200160208202803683370190505b50905060005b835181101561046b576103646106b9565b856001600160a01b031663c44b11f785848151811061037f57fe5b60200260200101516040518263ffffffff1660e01b81526004016103a3919061091b565b60206040518083038186803b1580156103bb57600080fd5b505afa1580156103cf573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103f391906108a4565b905060006104008261067d565b50505090508061042b57600084848151811061041857fe5b6020026020010181815250505050610463565b6104488a86858151811061043b57fe5b602002602001015161058d565b84848151811061045457fe5b60200260200101818152505050505b600101610353565b5061048a8773eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee61058d565b8184518151811061049757fe5b6020908102919091010152909450925050505b9250929050565b60608084830267ffffffffffffffff811180156104cd57600080fd5b506040519080825280602002602001820160405280156104f7578160200160208202803683370190505b50905060005b858110156105835760005b8481101561057a5761055588888481811061051f57fe5b90506020020160208101906105349190610719565b87878481811061054057fe5b90506020020160208101906100f19190610719565b83518490848802840190811061056757fe5b6020908102919091010152600101610508565b506001016104fd565b5095945050505050565b60006001600160a01b03821673eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee14156105c557506001600160a01b03821631610677565b6105d7826001600160a01b0316610103565b1561065f576040516370a0823160e01b81526001600160a01b038316906370a082319061060890869060040161091b565b60206040518083038186803b15801561062057600080fd5b505afa158015610634573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061065891906108c9565b9050610677565b60405162461bcd60e51b8152600401610062906109a2565b92915050565b51670100000000000000811615159167020000000000000082161515916704000000000000008116151591670800000000000000909116151590565b6040518060200160405280600081525090565b805161067781610a15565b60008083601f8401126106e8578182fd5b50813567ffffffffffffffff8111156106ff578182fd5b60208301915083602080830285010111156104aa57600080fd5b60006020828403121561072a578081fd5b813561073581610a15565b9392505050565b60006020828403121561074d578081fd5b815161073581610a15565b6000806040838503121561076a578081fd5b823561077581610a15565b9150602083013561078581610a15565b809150509250929050565b600080600080604085870312156107a5578182fd5b843567ffffffffffffffff808211156107bc578384fd5b6107c8888389016106d7565b909650945060208701359150808211156107e0578384fd5b506107ed878288016106d7565b95989497509550505050565b6000602080838503121561080b578182fd5b825167ffffffffffffffff80821115610822578384fd5b818501915085601f830112610835578384fd5b815181811115610843578485fd5b83810291506108538483016109ee565b8181528481019084860184860187018a101561086d578788fd5b8795505b83861015610897576108838a826106cc565b835260019590950194918601918601610871565b5098975050505050505050565b6000602082840312156108b5578081fd5b6108bf60206109ee565b9151825250919050565b6000602082840312156108da578081fd5b5051919050565b6000815180845260208085019450808401835b83811015610910578151875295820195908201906001016108f4565b509495945050505050565b6001600160a01b0391909116815260200190565b604080825283519082018190526000906020906060840190828701845b828110156109715781516001600160a01b03168452928401929084019060010161094c565b5050508381038285015261098581866108e1565b9695505050505050565b60006020825261073560208301846108e1565b6020808252600d908201526c24a72b20a624a22faa27a5a2a760991b604082015260600190565b602080825260029082015261191960f11b604082015260600190565b90815260200190565b60405181810167ffffffffffffffff81118282101715610a0d57600080fd5b604052919050565b6001600160a01b0381168114610a2a57600080fd5b5056fea264697066735822122053b2876fedb3e97868292733baf4560a434bf776bd636c7fb37a6702726c07e564736f6c634300060c0033";
