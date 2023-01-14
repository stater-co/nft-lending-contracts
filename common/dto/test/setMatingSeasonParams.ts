import { ethers } from "ethers";
import { SignerDependency } from "./raw/signerDependency.dto";

export interface SetMatingSeasonParams extends SignerDependency {
    contract: ethers.Contract;
    season: boolean;
  }