/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
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

export interface LendingMethodsInterface extends utils.Interface {
  contractName: "LendingMethods";
  functions: {
    "approveLoan(uint256)": FunctionFragment;
    "canBeTerminated(uint256)": FunctionFragment;
    "cancelLoan(uint256)": FunctionFragment;
    "checkLtv(uint256,uint256)": FunctionFragment;
    "createLoan(uint256,uint16,address,uint256,address[],uint256[],uint8[])": FunctionFragment;
    "discounts()": FunctionFragment;
    "editLoan(uint256,uint256,uint16,address,uint256,uint256)": FunctionFragment;
    "getLoanStartEnd(uint256)": FunctionFragment;
    "getPromissoryPermission(uint256)": FunctionFragment;
    "id()": FunctionFragment;
    "interestRate()": FunctionFragment;
    "interestRateToStater()": FunctionFragment;
    "lenderFee()": FunctionFragment;
    "lendingMethodsAddress()": FunctionFragment;
    "loans(uint256)": FunctionFragment;
    "ltv()": FunctionFragment;
    "onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)": FunctionFragment;
    "onERC1155Received(address,address,uint256,uint256,bytes)": FunctionFragment;
    "onERC721Received(address,address,uint256,bytes)": FunctionFragment;
    "owner()": FunctionFragment;
    "payLoan(uint256,uint256)": FunctionFragment;
    "promissoryExchange(address,address,uint256[])": FunctionFragment;
    "promissoryNoteAddress()": FunctionFragment;
    "promissoryPermissions(uint256)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setPromissoryPermissions(uint256[],address)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "terminateLoan(uint256)": FunctionFragment;
    "transferItems(address,address,address[],uint256[],uint8[])": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "transferTokens(address,address,address,uint256,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "approveLoan",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "canBeTerminated",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "cancelLoan",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "checkLtv",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "createLoan",
    values: [
      BigNumberish,
      BigNumberish,
      string,
      BigNumberish,
      string[],
      BigNumberish[],
      BigNumberish[]
    ]
  ): string;
  encodeFunctionData(functionFragment: "discounts", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "editLoan",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      string,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getLoanStartEnd",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPromissoryPermission",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "id", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "interestRate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "interestRateToStater",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "lenderFee", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "lendingMethodsAddress",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "loans", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "ltv", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "onERC1155BatchReceived",
    values: [string, string, BigNumberish[], BigNumberish[], BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "onERC1155Received",
    values: [string, string, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "onERC721Received",
    values: [string, string, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "payLoan",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "promissoryExchange",
    values: [string, string, BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "promissoryNoteAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "promissoryPermissions",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setPromissoryPermissions",
    values: [BigNumberish[], string]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "terminateLoan",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferItems",
    values: [string, string, string[], BigNumberish[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferTokens",
    values: [string, string, string, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "approveLoan",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "canBeTerminated",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "cancelLoan", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "checkLtv", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "createLoan", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "discounts", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "editLoan", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getLoanStartEnd",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPromissoryPermission",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "id", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "interestRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "interestRateToStater",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "lenderFee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "lendingMethodsAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "loans", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ltv", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "onERC1155BatchReceived",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "onERC1155Received",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "onERC721Received",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "payLoan", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "promissoryExchange",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "promissoryNoteAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "promissoryPermissions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPromissoryPermissions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "terminateLoan",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferItems",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferTokens",
    data: BytesLike
  ): Result;

  events: {
    "EditLoan(address,uint256,uint256,uint256,uint256,uint256,uint256,uint256)": EventFragment;
    "ItemsWithdrawn(address,uint256,uint8)": EventFragment;
    "LoanApproved(address,uint256,uint256)": EventFragment;
    "LoanCancelled(uint256)": EventFragment;
    "LoanPayment(uint256,uint256,uint256,uint256,uint256,uint8)": EventFragment;
    "NewLoan(address,address,uint256,address[],uint256[],uint8[])": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "EditLoan"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ItemsWithdrawn"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LoanApproved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LoanCancelled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LoanPayment"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NewLoan"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export type EditLoanEvent = TypedEvent<
  [
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ],
  {
    currency: string;
    loanId: BigNumber;
    loanAmount: BigNumber;
    amountDue: BigNumber;
    installmentAmount: BigNumber;
    assetsValue: BigNumber;
    frequencyTime: BigNumber;
    frequencyTimeUnit: BigNumber;
  }
>;

export type EditLoanEventFilter = TypedEventFilter<EditLoanEvent>;

export type ItemsWithdrawnEvent = TypedEvent<
  [string, BigNumber, number],
  { requester: string; loanId: BigNumber; status: number }
>;

export type ItemsWithdrawnEventFilter = TypedEventFilter<ItemsWithdrawnEvent>;

export type LoanApprovedEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  { lender: string; loanId: BigNumber; loanPaymentEnd: BigNumber }
>;

export type LoanApprovedEventFilter = TypedEventFilter<LoanApprovedEvent>;

export type LoanCancelledEvent = TypedEvent<[BigNumber], { loanId: BigNumber }>;

export type LoanCancelledEventFilter = TypedEventFilter<LoanCancelledEvent>;

export type LoanPaymentEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, number],
  {
    loanId: BigNumber;
    installmentAmount: BigNumber;
    amountPaidAsInstallmentToLender: BigNumber;
    interestPerInstallement: BigNumber;
    interestToStaterPerInstallement: BigNumber;
    status: number;
  }
>;

export type LoanPaymentEventFilter = TypedEventFilter<LoanPaymentEvent>;

export type NewLoanEvent = TypedEvent<
  [string, string, BigNumber, string[], BigNumber[], number[]],
  {
    owner: string;
    currency: string;
    loanId: BigNumber;
    nftAddressArray: string[];
    nftTokenIdArray: BigNumber[];
    nftTokenTypeArray: number[];
  }
>;

export type NewLoanEventFilter = TypedEventFilter<NewLoanEvent>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface LendingMethods extends BaseContract {
  contractName: "LendingMethods";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: LendingMethodsInterface;

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
    approveLoan(
      loanId: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    canBeTerminated(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    cancelLoan(
      loanId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    checkLtv(
      loanValue: BigNumberish,
      assetsValue: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[void]>;

    createLoan(
      loanAmount: BigNumberish,
      nrOfInstallments: BigNumberish,
      currency: string,
      assetsValue: BigNumberish,
      nftAddressArray: string[],
      nftTokenIdArray: BigNumberish[],
      nftTokenTypeArray: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    discounts(overrides?: CallOverrides): Promise<[string]>;

    editLoan(
      loanId: BigNumberish,
      loanAmount: BigNumberish,
      nrOfInstallments: BigNumberish,
      currency: string,
      assetsValue: BigNumberish,
      installmentTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getLoanStartEnd(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[[BigNumber, BigNumber]]>;

    getPromissoryPermission(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    id(overrides?: CallOverrides): Promise<[BigNumber]>;

    interestRate(overrides?: CallOverrides): Promise<[BigNumber]>;

    interestRateToStater(overrides?: CallOverrides): Promise<[BigNumber]>;

    lenderFee(overrides?: CallOverrides): Promise<[number]>;

    lendingMethodsAddress(overrides?: CallOverrides): Promise<[string]>;

    loans(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        string,
        string,
        number,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        number,
        number
      ] & {
        borrower: string;
        lender: string;
        currency: string;
        status: number;
        installmentTime: BigNumber;
        nrOfPayments: BigNumber;
        loanAmount: BigNumber;
        assetsValue: BigNumber;
        installmentAmount: BigNumber;
        amountDue: BigNumber;
        paidAmount: BigNumber;
        nrOfInstallments: number;
        defaultingLimit: number;
      }
    >;

    ltv(overrides?: CallOverrides): Promise<[BigNumber]>;

    onERC1155BatchReceived(
      arg0: string,
      arg1: string,
      arg2: BigNumberish[],
      arg3: BigNumberish[],
      arg4: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    onERC1155Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BigNumberish,
      arg4: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    onERC721Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    payLoan(
      loanId: BigNumberish,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    promissoryExchange(
      from: string,
      to: string,
      loanIds: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    promissoryNoteAddress(overrides?: CallOverrides): Promise<[string]>;

    promissoryPermissions(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setPromissoryPermissions(
      loanIds: BigNumberish[],
      allowed: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    terminateLoan(
      loanId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferItems(
      from: string,
      to: string,
      nftAddressArray: string[],
      nftTokenIdArray: BigNumberish[],
      nftTokenTypeArray: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferTokens(
      from: string,
      to: string,
      currency: string,
      qty1: BigNumberish,
      qty2: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  approveLoan(
    loanId: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  canBeTerminated(
    loanId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  cancelLoan(
    loanId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  checkLtv(
    loanValue: BigNumberish,
    assetsValue: BigNumberish,
    overrides?: CallOverrides
  ): Promise<void>;

  createLoan(
    loanAmount: BigNumberish,
    nrOfInstallments: BigNumberish,
    currency: string,
    assetsValue: BigNumberish,
    nftAddressArray: string[],
    nftTokenIdArray: BigNumberish[],
    nftTokenTypeArray: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  discounts(overrides?: CallOverrides): Promise<string>;

  editLoan(
    loanId: BigNumberish,
    loanAmount: BigNumberish,
    nrOfInstallments: BigNumberish,
    currency: string,
    assetsValue: BigNumberish,
    installmentTime: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getLoanStartEnd(
    loanId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber]>;

  getPromissoryPermission(
    loanId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  id(overrides?: CallOverrides): Promise<BigNumber>;

  interestRate(overrides?: CallOverrides): Promise<BigNumber>;

  interestRateToStater(overrides?: CallOverrides): Promise<BigNumber>;

  lenderFee(overrides?: CallOverrides): Promise<number>;

  lendingMethodsAddress(overrides?: CallOverrides): Promise<string>;

  loans(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [
      string,
      string,
      string,
      number,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      number,
      number
    ] & {
      borrower: string;
      lender: string;
      currency: string;
      status: number;
      installmentTime: BigNumber;
      nrOfPayments: BigNumber;
      loanAmount: BigNumber;
      assetsValue: BigNumber;
      installmentAmount: BigNumber;
      amountDue: BigNumber;
      paidAmount: BigNumber;
      nrOfInstallments: number;
      defaultingLimit: number;
    }
  >;

  ltv(overrides?: CallOverrides): Promise<BigNumber>;

  onERC1155BatchReceived(
    arg0: string,
    arg1: string,
    arg2: BigNumberish[],
    arg3: BigNumberish[],
    arg4: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  onERC1155Received(
    arg0: string,
    arg1: string,
    arg2: BigNumberish,
    arg3: BigNumberish,
    arg4: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  onERC721Received(
    arg0: string,
    arg1: string,
    arg2: BigNumberish,
    arg3: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  payLoan(
    loanId: BigNumberish,
    amount: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  promissoryExchange(
    from: string,
    to: string,
    loanIds: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  promissoryNoteAddress(overrides?: CallOverrides): Promise<string>;

  promissoryPermissions(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setPromissoryPermissions(
    loanIds: BigNumberish[],
    allowed: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  terminateLoan(
    loanId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferItems(
    from: string,
    to: string,
    nftAddressArray: string[],
    nftTokenIdArray: BigNumberish[],
    nftTokenTypeArray: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferTokens(
    from: string,
    to: string,
    currency: string,
    qty1: BigNumberish,
    qty2: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    approveLoan(loanId: BigNumberish, overrides?: CallOverrides): Promise<void>;

    canBeTerminated(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    cancelLoan(loanId: BigNumberish, overrides?: CallOverrides): Promise<void>;

    checkLtv(
      loanValue: BigNumberish,
      assetsValue: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    createLoan(
      loanAmount: BigNumberish,
      nrOfInstallments: BigNumberish,
      currency: string,
      assetsValue: BigNumberish,
      nftAddressArray: string[],
      nftTokenIdArray: BigNumberish[],
      nftTokenTypeArray: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    discounts(overrides?: CallOverrides): Promise<string>;

    editLoan(
      loanId: BigNumberish,
      loanAmount: BigNumberish,
      nrOfInstallments: BigNumberish,
      currency: string,
      assetsValue: BigNumberish,
      installmentTime: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getLoanStartEnd(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    getPromissoryPermission(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    id(overrides?: CallOverrides): Promise<BigNumber>;

    interestRate(overrides?: CallOverrides): Promise<BigNumber>;

    interestRateToStater(overrides?: CallOverrides): Promise<BigNumber>;

    lenderFee(overrides?: CallOverrides): Promise<number>;

    lendingMethodsAddress(overrides?: CallOverrides): Promise<string>;

    loans(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        string,
        string,
        number,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        number,
        number
      ] & {
        borrower: string;
        lender: string;
        currency: string;
        status: number;
        installmentTime: BigNumber;
        nrOfPayments: BigNumber;
        loanAmount: BigNumber;
        assetsValue: BigNumber;
        installmentAmount: BigNumber;
        amountDue: BigNumber;
        paidAmount: BigNumber;
        nrOfInstallments: number;
        defaultingLimit: number;
      }
    >;

    ltv(overrides?: CallOverrides): Promise<BigNumber>;

    onERC1155BatchReceived(
      arg0: string,
      arg1: string,
      arg2: BigNumberish[],
      arg3: BigNumberish[],
      arg4: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    onERC1155Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BigNumberish,
      arg4: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    onERC721Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    payLoan(
      loanId: BigNumberish,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    promissoryExchange(
      from: string,
      to: string,
      loanIds: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    promissoryNoteAddress(overrides?: CallOverrides): Promise<string>;

    promissoryPermissions(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setPromissoryPermissions(
      loanIds: BigNumberish[],
      allowed: string,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    terminateLoan(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    transferItems(
      from: string,
      to: string,
      nftAddressArray: string[],
      nftTokenIdArray: BigNumberish[],
      nftTokenTypeArray: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    transferTokens(
      from: string,
      to: string,
      currency: string,
      qty1: BigNumberish,
      qty2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "EditLoan(address,uint256,uint256,uint256,uint256,uint256,uint256,uint256)"(
      currency?: string | null,
      loanId?: BigNumberish | null,
      loanAmount?: null,
      amountDue?: null,
      installmentAmount?: null,
      assetsValue?: null,
      frequencyTime?: null,
      frequencyTimeUnit?: null
    ): EditLoanEventFilter;
    EditLoan(
      currency?: string | null,
      loanId?: BigNumberish | null,
      loanAmount?: null,
      amountDue?: null,
      installmentAmount?: null,
      assetsValue?: null,
      frequencyTime?: null,
      frequencyTimeUnit?: null
    ): EditLoanEventFilter;

    "ItemsWithdrawn(address,uint256,uint8)"(
      requester?: string | null,
      loanId?: BigNumberish | null,
      status?: null
    ): ItemsWithdrawnEventFilter;
    ItemsWithdrawn(
      requester?: string | null,
      loanId?: BigNumberish | null,
      status?: null
    ): ItemsWithdrawnEventFilter;

    "LoanApproved(address,uint256,uint256)"(
      lender?: string | null,
      loanId?: BigNumberish | null,
      loanPaymentEnd?: null
    ): LoanApprovedEventFilter;
    LoanApproved(
      lender?: string | null,
      loanId?: BigNumberish | null,
      loanPaymentEnd?: null
    ): LoanApprovedEventFilter;

    "LoanCancelled(uint256)"(
      loanId?: BigNumberish | null
    ): LoanCancelledEventFilter;
    LoanCancelled(loanId?: BigNumberish | null): LoanCancelledEventFilter;

    "LoanPayment(uint256,uint256,uint256,uint256,uint256,uint8)"(
      loanId?: BigNumberish | null,
      installmentAmount?: null,
      amountPaidAsInstallmentToLender?: null,
      interestPerInstallement?: null,
      interestToStaterPerInstallement?: null,
      status?: null
    ): LoanPaymentEventFilter;
    LoanPayment(
      loanId?: BigNumberish | null,
      installmentAmount?: null,
      amountPaidAsInstallmentToLender?: null,
      interestPerInstallement?: null,
      interestToStaterPerInstallement?: null,
      status?: null
    ): LoanPaymentEventFilter;

    "NewLoan(address,address,uint256,address[],uint256[],uint8[])"(
      owner?: string | null,
      currency?: string | null,
      loanId?: BigNumberish | null,
      nftAddressArray?: null,
      nftTokenIdArray?: null,
      nftTokenTypeArray?: null
    ): NewLoanEventFilter;
    NewLoan(
      owner?: string | null,
      currency?: string | null,
      loanId?: BigNumberish | null,
      nftAddressArray?: null,
      nftTokenIdArray?: null,
      nftTokenTypeArray?: null
    ): NewLoanEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    approveLoan(
      loanId: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    canBeTerminated(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    cancelLoan(
      loanId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    checkLtv(
      loanValue: BigNumberish,
      assetsValue: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createLoan(
      loanAmount: BigNumberish,
      nrOfInstallments: BigNumberish,
      currency: string,
      assetsValue: BigNumberish,
      nftAddressArray: string[],
      nftTokenIdArray: BigNumberish[],
      nftTokenTypeArray: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    discounts(overrides?: CallOverrides): Promise<BigNumber>;

    editLoan(
      loanId: BigNumberish,
      loanAmount: BigNumberish,
      nrOfInstallments: BigNumberish,
      currency: string,
      assetsValue: BigNumberish,
      installmentTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getLoanStartEnd(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPromissoryPermission(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    id(overrides?: CallOverrides): Promise<BigNumber>;

    interestRate(overrides?: CallOverrides): Promise<BigNumber>;

    interestRateToStater(overrides?: CallOverrides): Promise<BigNumber>;

    lenderFee(overrides?: CallOverrides): Promise<BigNumber>;

    lendingMethodsAddress(overrides?: CallOverrides): Promise<BigNumber>;

    loans(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    ltv(overrides?: CallOverrides): Promise<BigNumber>;

    onERC1155BatchReceived(
      arg0: string,
      arg1: string,
      arg2: BigNumberish[],
      arg3: BigNumberish[],
      arg4: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    onERC1155Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BigNumberish,
      arg4: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    onERC721Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    payLoan(
      loanId: BigNumberish,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    promissoryExchange(
      from: string,
      to: string,
      loanIds: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    promissoryNoteAddress(overrides?: CallOverrides): Promise<BigNumber>;

    promissoryPermissions(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setPromissoryPermissions(
      loanIds: BigNumberish[],
      allowed: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    terminateLoan(
      loanId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferItems(
      from: string,
      to: string,
      nftAddressArray: string[],
      nftTokenIdArray: BigNumberish[],
      nftTokenTypeArray: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferTokens(
      from: string,
      to: string,
      currency: string,
      qty1: BigNumberish,
      qty2: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    approveLoan(
      loanId: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    canBeTerminated(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    cancelLoan(
      loanId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    checkLtv(
      loanValue: BigNumberish,
      assetsValue: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    createLoan(
      loanAmount: BigNumberish,
      nrOfInstallments: BigNumberish,
      currency: string,
      assetsValue: BigNumberish,
      nftAddressArray: string[],
      nftTokenIdArray: BigNumberish[],
      nftTokenTypeArray: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    discounts(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    editLoan(
      loanId: BigNumberish,
      loanAmount: BigNumberish,
      nrOfInstallments: BigNumberish,
      currency: string,
      assetsValue: BigNumberish,
      installmentTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getLoanStartEnd(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPromissoryPermission(
      loanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    id(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    interestRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    interestRateToStater(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lenderFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lendingMethodsAddress(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    loans(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    ltv(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    onERC1155BatchReceived(
      arg0: string,
      arg1: string,
      arg2: BigNumberish[],
      arg3: BigNumberish[],
      arg4: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    onERC1155Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BigNumberish,
      arg4: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    onERC721Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    payLoan(
      loanId: BigNumberish,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    promissoryExchange(
      from: string,
      to: string,
      loanIds: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    promissoryNoteAddress(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    promissoryPermissions(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setPromissoryPermissions(
      loanIds: BigNumberish[],
      allowed: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    terminateLoan(
      loanId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferItems(
      from: string,
      to: string,
      nftAddressArray: string[],
      nftTokenIdArray: BigNumberish[],
      nftTokenTypeArray: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferTokens(
      from: string,
      to: string,
      currency: string,
      qty1: BigNumberish,
      qty2: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
