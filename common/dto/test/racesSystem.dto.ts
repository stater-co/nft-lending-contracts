import { RacesRestricted } from '../../../typechain-types/contracts/races/restricted/Index.sol/RacesRestricted';
import { RacesMethods } from '../../../typechain-types/contracts/races/methods/Index.sol/RacesMethods';
import { Races } from '../../../typechain-types/contracts/races/Index.sol/Races';

export interface RacesSystem {
    racesRestricted: RacesRestricted;
    racesMethods: RacesMethods;
    races: Races;
}