import { Race, Races } from "../../../typechain-types/Races";
import { Signer } from "ethers";
import { Queues } from "../../../typechain-types/Queues";
import { Hounds } from "../../../typechain-types/Hounds";

export interface UploadRaceParams {
    contract: Races;
    race: Race.StructStructOutput;
    queues: Queues;
    hounds: Hounds;
    onId: number;
    signer: Signer;
  }