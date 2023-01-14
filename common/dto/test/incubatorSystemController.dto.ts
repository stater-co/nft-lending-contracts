import { IncubatorConstructor, Incubator } from '../../../typechain-types/Incubator';
import { IncubatorMethods } from '../../../typechain-types/IncubatorMethods';

export interface IncubatorSystemController {
    incubatorMethods: IncubatorMethods;
    incubator: Incubator;
    constructor: IncubatorConstructor.StructStruct;
}