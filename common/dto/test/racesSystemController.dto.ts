import { Races, RacesConstructor } from '../../../typechain-types/Races';
import { RacesMethods } from "../../../typechain-types/RacesMethods";
import { RacesRestricted } from "../../../typechain-types/RacesRestricted";

export interface RacesSystemController {
    racesRestricted: RacesRestricted;
    racesMethods: RacesMethods;
    races: Races;
    constructor: RacesConstructor.StructStruct;
    queuesAddress: string;
}