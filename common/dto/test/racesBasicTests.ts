import { Hounds } from "../../../typechain-types/Hounds";
import { Queues } from "../../../typechain-types/Queues";
import { Race, Races } from "../../../typechain-types/Races";


export interface RacesBasicTests {
    contract: Races;
    race: Race.StructStructOutput;
    hounds: Hounds;
    queues: Queues;
}