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

interface IAaveIncentivesControllerInterface extends ethers.utils.Interface {
  functions: {
    "DISTRIBUTION_END()": FunctionFragment;
    "PRECISION()": FunctionFragment;
    "REWARD_TOKEN()": FunctionFragment;
    "claimRewards(address[],uint256,address)": FunctionFragment;
    "claimRewardsOnBehalf(address[],uint256,address,address)": FunctionFragment;
    "configureAssets(address[],uint256[])": FunctionFragment;
    "getAssetData(address)": FunctionFragment;
    "getClaimer(address)": FunctionFragment;
    "getRewardsBalance(address[],address)": FunctionFragment;
    "getUserAssetData(address,address)": FunctionFragment;
    "getUserUnclaimedRewards(address)": FunctionFragment;
    "handleAction(address,uint256,uint256)": FunctionFragment;
    "setClaimer(address,address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "DISTRIBUTION_END",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "PRECISION", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "REWARD_TOKEN",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "claimRewards",
    values: [string[], BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "claimRewardsOnBehalf",
    values: [string[], BigNumberish, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "configureAssets",
    values: [string[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "getAssetData",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "getClaimer", values: [string]): string;
  encodeFunctionData(
    functionFragment: "getRewardsBalance",
    values: [string[], string]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserAssetData",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserUnclaimedRewards",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "handleAction",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setClaimer",
    values: [string, string]
  ): string;

  decodeFunctionResult(
    functionFragment: "DISTRIBUTION_END",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "PRECISION", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "REWARD_TOKEN",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimRewardsOnBehalf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "configureAssets",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAssetData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getClaimer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getRewardsBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserAssetData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserUnclaimedRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "handleAction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setClaimer", data: BytesLike): Result;

  events: {
    "ClaimerSet(address,address)": EventFragment;
    "RewardsAccrued(address,uint256)": EventFragment;
    "RewardsClaimed(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ClaimerSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RewardsAccrued"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RewardsClaimed"): EventFragment;
}

export class IAaveIncentivesController extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: IAaveIncentivesControllerInterface;

  functions: {
    DISTRIBUTION_END(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "DISTRIBUTION_END()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    PRECISION(overrides?: CallOverrides): Promise<{
      0: number;
    }>;

    "PRECISION()"(overrides?: CallOverrides): Promise<{
      0: number;
    }>;

    REWARD_TOKEN(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    "REWARD_TOKEN()"(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    claimRewards(
      assets: string[],
      amount: BigNumberish,
      to: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "claimRewards(address[],uint256,address)"(
      assets: string[],
      amount: BigNumberish,
      to: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    claimRewardsOnBehalf(
      assets: string[],
      amount: BigNumberish,
      user: string,
      to: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "claimRewardsOnBehalf(address[],uint256,address,address)"(
      assets: string[],
      amount: BigNumberish,
      user: string,
      to: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    configureAssets(
      assets: string[],
      emissionsPerSecond: BigNumberish[],
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "configureAssets(address[],uint256[])"(
      assets: string[],
      emissionsPerSecond: BigNumberish[],
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    getAssetData(
      asset: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
    }>;

    "getAssetData(address)"(
      asset: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
    }>;

    getClaimer(
      user: string,
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    "getClaimer(address)"(
      user: string,
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    getRewardsBalance(
      assets: string[],
      user: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    "getRewardsBalance(address[],address)"(
      assets: string[],
      user: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    getUserAssetData(
      user: string,
      asset: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    "getUserAssetData(address,address)"(
      user: string,
      asset: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    getUserUnclaimedRewards(
      user: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    "getUserUnclaimedRewards(address)"(
      user: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    handleAction(
      asset: string,
      userBalance: BigNumberish,
      totalSupply: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "handleAction(address,uint256,uint256)"(
      asset: string,
      userBalance: BigNumberish,
      totalSupply: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    setClaimer(
      user: string,
      claimer: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setClaimer(address,address)"(
      user: string,
      claimer: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  DISTRIBUTION_END(overrides?: CallOverrides): Promise<BigNumber>;

  "DISTRIBUTION_END()"(overrides?: CallOverrides): Promise<BigNumber>;

  PRECISION(overrides?: CallOverrides): Promise<number>;

  "PRECISION()"(overrides?: CallOverrides): Promise<number>;

  REWARD_TOKEN(overrides?: CallOverrides): Promise<string>;

  "REWARD_TOKEN()"(overrides?: CallOverrides): Promise<string>;

  claimRewards(
    assets: string[],
    amount: BigNumberish,
    to: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "claimRewards(address[],uint256,address)"(
    assets: string[],
    amount: BigNumberish,
    to: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  claimRewardsOnBehalf(
    assets: string[],
    amount: BigNumberish,
    user: string,
    to: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "claimRewardsOnBehalf(address[],uint256,address,address)"(
    assets: string[],
    amount: BigNumberish,
    user: string,
    to: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  configureAssets(
    assets: string[],
    emissionsPerSecond: BigNumberish[],
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "configureAssets(address[],uint256[])"(
    assets: string[],
    emissionsPerSecond: BigNumberish[],
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  getAssetData(
    asset: string,
    overrides?: CallOverrides
  ): Promise<{
    0: BigNumber;
    1: BigNumber;
    2: BigNumber;
  }>;

  "getAssetData(address)"(
    asset: string,
    overrides?: CallOverrides
  ): Promise<{
    0: BigNumber;
    1: BigNumber;
    2: BigNumber;
  }>;

  getClaimer(user: string, overrides?: CallOverrides): Promise<string>;

  "getClaimer(address)"(
    user: string,
    overrides?: CallOverrides
  ): Promise<string>;

  getRewardsBalance(
    assets: string[],
    user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getRewardsBalance(address[],address)"(
    assets: string[],
    user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getUserAssetData(
    user: string,
    asset: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getUserAssetData(address,address)"(
    user: string,
    asset: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getUserUnclaimedRewards(
    user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getUserUnclaimedRewards(address)"(
    user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  handleAction(
    asset: string,
    userBalance: BigNumberish,
    totalSupply: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "handleAction(address,uint256,uint256)"(
    asset: string,
    userBalance: BigNumberish,
    totalSupply: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  setClaimer(
    user: string,
    claimer: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setClaimer(address,address)"(
    user: string,
    claimer: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    DISTRIBUTION_END(overrides?: CallOverrides): Promise<BigNumber>;

    "DISTRIBUTION_END()"(overrides?: CallOverrides): Promise<BigNumber>;

    PRECISION(overrides?: CallOverrides): Promise<number>;

    "PRECISION()"(overrides?: CallOverrides): Promise<number>;

    REWARD_TOKEN(overrides?: CallOverrides): Promise<string>;

    "REWARD_TOKEN()"(overrides?: CallOverrides): Promise<string>;

    claimRewards(
      assets: string[],
      amount: BigNumberish,
      to: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "claimRewards(address[],uint256,address)"(
      assets: string[],
      amount: BigNumberish,
      to: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claimRewardsOnBehalf(
      assets: string[],
      amount: BigNumberish,
      user: string,
      to: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "claimRewardsOnBehalf(address[],uint256,address,address)"(
      assets: string[],
      amount: BigNumberish,
      user: string,
      to: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    configureAssets(
      assets: string[],
      emissionsPerSecond: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    "configureAssets(address[],uint256[])"(
      assets: string[],
      emissionsPerSecond: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    getAssetData(
      asset: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
    }>;

    "getAssetData(address)"(
      asset: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
    }>;

    getClaimer(user: string, overrides?: CallOverrides): Promise<string>;

    "getClaimer(address)"(
      user: string,
      overrides?: CallOverrides
    ): Promise<string>;

    getRewardsBalance(
      assets: string[],
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getRewardsBalance(address[],address)"(
      assets: string[],
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserAssetData(
      user: string,
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getUserAssetData(address,address)"(
      user: string,
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserUnclaimedRewards(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getUserUnclaimedRewards(address)"(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    handleAction(
      asset: string,
      userBalance: BigNumberish,
      totalSupply: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "handleAction(address,uint256,uint256)"(
      asset: string,
      userBalance: BigNumberish,
      totalSupply: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setClaimer(
      user: string,
      claimer: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "setClaimer(address,address)"(
      user: string,
      claimer: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    ClaimerSet(user: string | null, claimer: string | null): EventFilter;

    RewardsAccrued(user: string | null, amount: null): EventFilter;

    RewardsClaimed(
      user: string | null,
      to: string | null,
      amount: null
    ): EventFilter;
  };

  estimateGas: {
    DISTRIBUTION_END(overrides?: CallOverrides): Promise<BigNumber>;

    "DISTRIBUTION_END()"(overrides?: CallOverrides): Promise<BigNumber>;

    PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    "PRECISION()"(overrides?: CallOverrides): Promise<BigNumber>;

    REWARD_TOKEN(overrides?: CallOverrides): Promise<BigNumber>;

    "REWARD_TOKEN()"(overrides?: CallOverrides): Promise<BigNumber>;

    claimRewards(
      assets: string[],
      amount: BigNumberish,
      to: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "claimRewards(address[],uint256,address)"(
      assets: string[],
      amount: BigNumberish,
      to: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    claimRewardsOnBehalf(
      assets: string[],
      amount: BigNumberish,
      user: string,
      to: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "claimRewardsOnBehalf(address[],uint256,address,address)"(
      assets: string[],
      amount: BigNumberish,
      user: string,
      to: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    configureAssets(
      assets: string[],
      emissionsPerSecond: BigNumberish[],
      overrides?: Overrides
    ): Promise<BigNumber>;

    "configureAssets(address[],uint256[])"(
      assets: string[],
      emissionsPerSecond: BigNumberish[],
      overrides?: Overrides
    ): Promise<BigNumber>;

    getAssetData(asset: string, overrides?: CallOverrides): Promise<BigNumber>;

    "getAssetData(address)"(
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getClaimer(user: string, overrides?: CallOverrides): Promise<BigNumber>;

    "getClaimer(address)"(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRewardsBalance(
      assets: string[],
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getRewardsBalance(address[],address)"(
      assets: string[],
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserAssetData(
      user: string,
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getUserAssetData(address,address)"(
      user: string,
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserUnclaimedRewards(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getUserUnclaimedRewards(address)"(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    handleAction(
      asset: string,
      userBalance: BigNumberish,
      totalSupply: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "handleAction(address,uint256,uint256)"(
      asset: string,
      userBalance: BigNumberish,
      totalSupply: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    setClaimer(
      user: string,
      claimer: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "setClaimer(address,address)"(
      user: string,
      claimer: string,
      overrides?: Overrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    DISTRIBUTION_END(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "DISTRIBUTION_END()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    PRECISION(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "PRECISION()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    REWARD_TOKEN(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "REWARD_TOKEN()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    claimRewards(
      assets: string[],
      amount: BigNumberish,
      to: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "claimRewards(address[],uint256,address)"(
      assets: string[],
      amount: BigNumberish,
      to: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    claimRewardsOnBehalf(
      assets: string[],
      amount: BigNumberish,
      user: string,
      to: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "claimRewardsOnBehalf(address[],uint256,address,address)"(
      assets: string[],
      amount: BigNumberish,
      user: string,
      to: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    configureAssets(
      assets: string[],
      emissionsPerSecond: BigNumberish[],
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "configureAssets(address[],uint256[])"(
      assets: string[],
      emissionsPerSecond: BigNumberish[],
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    getAssetData(
      asset: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getAssetData(address)"(
      asset: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getClaimer(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getClaimer(address)"(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRewardsBalance(
      assets: string[],
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getRewardsBalance(address[],address)"(
      assets: string[],
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserAssetData(
      user: string,
      asset: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getUserAssetData(address,address)"(
      user: string,
      asset: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserUnclaimedRewards(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getUserUnclaimedRewards(address)"(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    handleAction(
      asset: string,
      userBalance: BigNumberish,
      totalSupply: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "handleAction(address,uint256,uint256)"(
      asset: string,
      userBalance: BigNumberish,
      totalSupply: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    setClaimer(
      user: string,
      claimer: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setClaimer(address,address)"(
      user: string,
      claimer: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}
