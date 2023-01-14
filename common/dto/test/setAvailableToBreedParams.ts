import { Hounds } from "../../../typechain-types/Hounds";

export interface SetAvailableToBreedParams {
    contract: Hounds;
    houndId: number | string;
    fee: number | string;
    status: boolean;
  }