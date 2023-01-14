import { ethers } from "ethers";
import { ArenasRestricted } from '../../../typechain-types/contracts/arenas/restricted/Index.sol/ArenasRestricted';
import { ArenasMethods } from '../../../typechain-types/contracts/arenas/methods/Index.sol/ArenasMethods';
import { Arenas } from '../../../typechain-types/contracts/arenas/Index.sol/Arenas';

export interface ArenasSystem {
    arenasRestricted: ArenasRestricted;
    arenasMethods: ArenasMethods;
    arenas: Arenas;
}