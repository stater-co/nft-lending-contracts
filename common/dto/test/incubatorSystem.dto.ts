import { IncubatorMethods } from '../../../typechain-types/IncubatorMethods';
import { Incubator } from '../../../typechain-types/Incubator';

export interface IncubatorSystem {
    incubatorMethods: IncubatorMethods;
    incubator: Incubator;
}