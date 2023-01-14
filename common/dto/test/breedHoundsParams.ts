import { Signer } from "ethers";
import { Hounds } from "../../../typechain-types/Hounds";

export interface BreedHoundsParams {
    contract: Hounds;
    hound1: string | number;
    hound2: string | number;
    signer: Signer;
  }