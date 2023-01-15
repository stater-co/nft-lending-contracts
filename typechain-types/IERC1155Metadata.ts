/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface IERC1155MetadataInterface extends utils.Interface {
  contractName: "IERC1155Metadata";
  functions: {
    "uri(uint256)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "uri", values: [BigNumberish]): string;

  decodeFunctionResult(functionFragment: "uri", data: BytesLike): Result;

  events: {
    "URI(string,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "URI"): EventFragment;
}

export type URIEvent = TypedEvent<
  [string, BigNumber],
  { _uri: string; _id: BigNumber }
>;

export type URIEventFilter = TypedEventFilter<URIEvent>;

export interface IERC1155Metadata extends BaseContract {
  contractName: "IERC1155Metadata";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IERC1155MetadataInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    uri(_id: BigNumberish, overrides?: CallOverrides): Promise<[string]>;
  };

  uri(_id: BigNumberish, overrides?: CallOverrides): Promise<string>;

  callStatic: {
    uri(_id: BigNumberish, overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "URI(string,uint256)"(
      _uri?: null,
      _id?: BigNumberish | null
    ): URIEventFilter;
    URI(_uri?: null, _id?: BigNumberish | null): URIEventFilter;
  };

  estimateGas: {
    uri(_id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    uri(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
