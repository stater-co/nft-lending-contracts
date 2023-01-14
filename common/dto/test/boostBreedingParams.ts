import { Signer } from "ethers";
import { Hounds } from "../../../typechain-types/Hounds";

export interface BoostBreedingParams {
    contract: Hounds;
    signer: Signer;
  }