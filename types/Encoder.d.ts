/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface EncoderInterface extends ethers.utils.Interface {
  functions: {
    "encodeCreateLoan(tuple)": FunctionFragment;
    "encodeCreateLoanWithHealth(tuple)": FunctionFragment;
    "encodeLackOfPayment(uint256)": FunctionFragment;
    "encodeLtvSetter(uint256)": FunctionFragment;
    "ltv()": FunctionFragment;
    "setLtv(uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "encodeCreateLoan",
    values: [
      {
        currency: string;
        nftAddressArray: string[];
        loanAmount: BigNumberish;
        installmentTime: BigNumberish;
        assetsValue: BigNumberish;
        nftTokenIdArray: BigNumberish[];
        nrOfInstallments: BigNumberish;
        nftTokenTypeArray: BigNumberish[];
      }
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "encodeCreateLoanWithHealth",
    values: [
      {
        currency: string;
        installmentTime: BigNumberish;
        nftTokenIdArray: BigNumberish[];
        loanAmount: BigNumberish;
        nrOfInstallments: BigNumberish;
      }
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "encodeLackOfPayment",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "encodeLtvSetter",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "ltv", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setLtv",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "encodeCreateLoan",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "encodeCreateLoanWithHealth",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "encodeLackOfPayment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "encodeLtvSetter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ltv", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setLtv", data: BytesLike): Result;

  events: {};
}

export class Encoder extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: EncoderInterface;

  functions: {
    encodeCreateLoan(
      loan: {
        currency: string;
        nftAddressArray: string[];
        loanAmount: BigNumberish;
        installmentTime: BigNumberish;
        assetsValue: BigNumberish;
        nftTokenIdArray: BigNumberish[];
        nrOfInstallments: BigNumberish;
        nftTokenTypeArray: BigNumberish[];
      },
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    "encodeCreateLoan((address,address[],uint256,uint256,uint256,uint256[],uint16,uint8[]))"(
      loan: {
        currency: string;
        nftAddressArray: string[];
        loanAmount: BigNumberish;
        installmentTime: BigNumberish;
        assetsValue: BigNumberish;
        nftTokenIdArray: BigNumberish[];
        nrOfInstallments: BigNumberish;
        nftTokenTypeArray: BigNumberish[];
      },
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    encodeCreateLoanWithHealth(
      loan: {
        currency: string;
        installmentTime: BigNumberish;
        nftTokenIdArray: BigNumberish[];
        loanAmount: BigNumberish;
        nrOfInstallments: BigNumberish;
      },
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    "encodeCreateLoanWithHealth((address,uint256,uint256[],uint256,uint16))"(
      loan: {
        currency: string;
        installmentTime: BigNumberish;
        nftTokenIdArray: BigNumberish[];
        loanAmount: BigNumberish;
        nrOfInstallments: BigNumberish;
      },
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    encodeLackOfPayment(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    "encodeLackOfPayment(uint256)"(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    encodeLtvSetter(
      newLtv: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    "encodeLtvSetter(uint256)"(
      newLtv: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    ltv(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "ltv()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    setLtv(
      newLtv: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setLtv(uint256)"(
      newLtv: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  encodeCreateLoan(
    loan: {
      currency: string;
      nftAddressArray: string[];
      loanAmount: BigNumberish;
      installmentTime: BigNumberish;
      assetsValue: BigNumberish;
      nftTokenIdArray: BigNumberish[];
      nrOfInstallments: BigNumberish;
      nftTokenTypeArray: BigNumberish[];
    },
    overrides?: CallOverrides
  ): Promise<string>;

  "encodeCreateLoan((address,address[],uint256,uint256,uint256,uint256[],uint16,uint8[]))"(
    loan: {
      currency: string;
      nftAddressArray: string[];
      loanAmount: BigNumberish;
      installmentTime: BigNumberish;
      assetsValue: BigNumberish;
      nftTokenIdArray: BigNumberish[];
      nrOfInstallments: BigNumberish;
      nftTokenTypeArray: BigNumberish[];
    },
    overrides?: CallOverrides
  ): Promise<string>;

  encodeCreateLoanWithHealth(
    loan: {
      currency: string;
      installmentTime: BigNumberish;
      nftTokenIdArray: BigNumberish[];
      loanAmount: BigNumberish;
      nrOfInstallments: BigNumberish;
    },
    overrides?: CallOverrides
  ): Promise<string>;

  "encodeCreateLoanWithHealth((address,uint256,uint256[],uint256,uint16))"(
    loan: {
      currency: string;
      installmentTime: BigNumberish;
      nftTokenIdArray: BigNumberish[];
      loanAmount: BigNumberish;
      nrOfInstallments: BigNumberish;
    },
    overrides?: CallOverrides
  ): Promise<string>;

  encodeLackOfPayment(
    loanId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  "encodeLackOfPayment(uint256)"(
    loanId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  encodeLtvSetter(
    newLtv: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  "encodeLtvSetter(uint256)"(
    newLtv: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  ltv(overrides?: CallOverrides): Promise<BigNumber>;

  "ltv()"(overrides?: CallOverrides): Promise<BigNumber>;

  setLtv(
    newLtv: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setLtv(uint256)"(
    newLtv: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    encodeCreateLoan(
      loan: {
        currency: string;
        nftAddressArray: string[];
        loanAmount: BigNumberish;
        installmentTime: BigNumberish;
        assetsValue: BigNumberish;
        nftTokenIdArray: BigNumberish[];
        nrOfInstallments: BigNumberish;
        nftTokenTypeArray: BigNumberish[];
      },
      overrides?: CallOverrides
    ): Promise<string>;

    "encodeCreateLoan((address,address[],uint256,uint256,uint256,uint256[],uint16,uint8[]))"(
      loan: {
        currency: string;
        nftAddressArray: string[];
        loanAmount: BigNumberish;
        installmentTime: BigNumberish;
        assetsValue: BigNumberish;
        nftTokenIdArray: BigNumberish[];
        nrOfInstallments: BigNumberish;
        nftTokenTypeArray: BigNumberish[];
      },
      overrides?: CallOverrides
    ): Promise<string>;

    encodeCreateLoanWithHealth(
      loan: {
        currency: string;
        installmentTime: BigNumberish;
        nftTokenIdArray: BigNumberish[];
        loanAmount: BigNumberish;
        nrOfInstallments: BigNumberish;
      },
      overrides?: CallOverrides
    ): Promise<string>;

    "encodeCreateLoanWithHealth((address,uint256,uint256[],uint256,uint16))"(
      loan: {
        currency: string;
        installmentTime: BigNumberish;
        nftTokenIdArray: BigNumberish[];
        loanAmount: BigNumberish;
        nrOfInstallments: BigNumberish;
      },
      overrides?: CallOverrides
    ): Promise<string>;

    encodeLackOfPayment(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    "encodeLackOfPayment(uint256)"(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    encodeLtvSetter(
      newLtv: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    "encodeLtvSetter(uint256)"(
      newLtv: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    ltv(overrides?: CallOverrides): Promise<BigNumber>;

    "ltv()"(overrides?: CallOverrides): Promise<BigNumber>;

    setLtv(newLtv: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    "setLtv(uint256)"(
      newLtv: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    encodeCreateLoan(
      loan: {
        currency: string;
        nftAddressArray: string[];
        loanAmount: BigNumberish;
        installmentTime: BigNumberish;
        assetsValue: BigNumberish;
        nftTokenIdArray: BigNumberish[];
        nrOfInstallments: BigNumberish;
        nftTokenTypeArray: BigNumberish[];
      },
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "encodeCreateLoan((address,address[],uint256,uint256,uint256,uint256[],uint16,uint8[]))"(
      loan: {
        currency: string;
        nftAddressArray: string[];
        loanAmount: BigNumberish;
        installmentTime: BigNumberish;
        assetsValue: BigNumberish;
        nftTokenIdArray: BigNumberish[];
        nrOfInstallments: BigNumberish;
        nftTokenTypeArray: BigNumberish[];
      },
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    encodeCreateLoanWithHealth(
      loan: {
        currency: string;
        installmentTime: BigNumberish;
        nftTokenIdArray: BigNumberish[];
        loanAmount: BigNumberish;
        nrOfInstallments: BigNumberish;
      },
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "encodeCreateLoanWithHealth((address,uint256,uint256[],uint256,uint16))"(
      loan: {
        currency: string;
        installmentTime: BigNumberish;
        nftTokenIdArray: BigNumberish[];
        loanAmount: BigNumberish;
        nrOfInstallments: BigNumberish;
      },
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    encodeLackOfPayment(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "encodeLackOfPayment(uint256)"(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    encodeLtvSetter(
      newLtv: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "encodeLtvSetter(uint256)"(
      newLtv: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    ltv(overrides?: CallOverrides): Promise<BigNumber>;

    "ltv()"(overrides?: CallOverrides): Promise<BigNumber>;

    setLtv(newLtv: BigNumberish, overrides?: Overrides): Promise<BigNumber>;

    "setLtv(uint256)"(
      newLtv: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    encodeCreateLoan(
      loan: {
        currency: string;
        nftAddressArray: string[];
        loanAmount: BigNumberish;
        installmentTime: BigNumberish;
        assetsValue: BigNumberish;
        nftTokenIdArray: BigNumberish[];
        nrOfInstallments: BigNumberish;
        nftTokenTypeArray: BigNumberish[];
      },
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "encodeCreateLoan((address,address[],uint256,uint256,uint256,uint256[],uint16,uint8[]))"(
      loan: {
        currency: string;
        nftAddressArray: string[];
        loanAmount: BigNumberish;
        installmentTime: BigNumberish;
        assetsValue: BigNumberish;
        nftTokenIdArray: BigNumberish[];
        nrOfInstallments: BigNumberish;
        nftTokenTypeArray: BigNumberish[];
      },
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    encodeCreateLoanWithHealth(
      loan: {
        currency: string;
        installmentTime: BigNumberish;
        nftTokenIdArray: BigNumberish[];
        loanAmount: BigNumberish;
        nrOfInstallments: BigNumberish;
      },
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "encodeCreateLoanWithHealth((address,uint256,uint256[],uint256,uint16))"(
      loan: {
        currency: string;
        installmentTime: BigNumberish;
        nftTokenIdArray: BigNumberish[];
        loanAmount: BigNumberish;
        nrOfInstallments: BigNumberish;
      },
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    encodeLackOfPayment(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "encodeLackOfPayment(uint256)"(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    encodeLtvSetter(
      newLtv: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "encodeLtvSetter(uint256)"(
      newLtv: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    ltv(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "ltv()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setLtv(
      newLtv: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setLtv(uint256)"(
      newLtv: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}
