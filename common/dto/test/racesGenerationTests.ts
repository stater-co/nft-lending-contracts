import { Arena } from "../../../typechain-types/Arenas";
import { Gamification } from "../../../typechain-types/Gamification";
import { Hounds } from "../../../typechain-types/Hounds";
import { Race, Races } from "../../../typechain-types/Races";


export interface RacesGenerationTests {
    race: Race.StructStructOutput;
    hounds: Hounds;
    arena: Arena.StructStructOutput;
    gamification: Gamification;
    races: Races;
}