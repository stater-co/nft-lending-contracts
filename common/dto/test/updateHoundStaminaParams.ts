import { BigNumber } from "ethers";
import { Hounds } from "../../../typechain-types/Hounds";
import { SignerDependency } from "./raw/signerDependency.dto";

export interface UpdateHoundStaminaParams extends SignerDependency {
    contract: Hounds;
    houndId: string | number | BigNumber
  }