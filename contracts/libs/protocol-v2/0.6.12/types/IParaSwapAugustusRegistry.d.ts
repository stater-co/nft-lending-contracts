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
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface IParaSwapAugustusRegistryInterface extends ethers.utils.Interface {
  functions: {
    "isValidAugustus(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "isValidAugustus",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "isValidAugustus",
    data: BytesLike
  ): Result;

  events: {};
}

export class IParaSwapAugustusRegistry extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: IParaSwapAugustusRegistryInterface;

  functions: {
    isValidAugustus(
      augustus: string,
      overrides?: CallOverrides
    ): Promise<{
      0: boolean;
    }>;

    "isValidAugustus(address)"(
      augustus: string,
      overrides?: CallOverrides
    ): Promise<{
      0: boolean;
    }>;
  };

  isValidAugustus(
    augustus: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  "isValidAugustus(address)"(
    augustus: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    isValidAugustus(
      augustus: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "isValidAugustus(address)"(
      augustus: string,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {};

  estimateGas: {
    isValidAugustus(
      augustus: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "isValidAugustus(address)"(
      augustus: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    isValidAugustus(
      augustus: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "isValidAugustus(address)"(
      augustus: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
