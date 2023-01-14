import { Arenas, ArenasConstructor } from '../../../typechain-types/Arenas';

export interface ArenasSystemController {
    arenasRestricted: Arenas;
    arenasMethods: Arenas;
    arenas: Arenas;
    constructor: ArenasConstructor.StructStruct;
    racesAddress: string;
}