import { Signer } from "ethers";
import { Hounds } from "../../../typechain-types/Hounds";

export interface BoostStaminaParams {
    contract: Hounds;
    signer: Signer;
  }