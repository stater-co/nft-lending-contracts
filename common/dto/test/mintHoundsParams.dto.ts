import { Hound, Hounds } from '../../../typechain-types/Hounds';
import { Races } from "../../../typechain-types/Races";
import { SignerDependency } from "./raw/signerDependency.dto";

export interface MintHoundParams extends SignerDependency {
    contract: Hounds;
    hound: Hound.StructStructOutput;
    races: Races;
    owner: string;
    position: number;
}