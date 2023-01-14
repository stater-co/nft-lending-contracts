import { Constructor, Hounds } from '../../../typechain-types/Hounds';
import { HoundsMinter } from '../../../typechain-types/HoundsMinter';
import { HoundsModifier } from '../../../typechain-types/HoundsModifier';
import { HoundsRestricted } from '../../../typechain-types/HoundsRestricted';
import { HoundsZerocost } from '../../../typechain-types/HoundsZerocost';

export interface HoundsSystemController {
    houndsRestricted: HoundsRestricted;
    houndsModifier: HoundsModifier;
    houndsMinter: HoundsMinter;
    houndsZerocost: HoundsZerocost;
    hounds: Hounds;
    constructor: Constructor.StructStruct;
    queuesAddress: string;
    racesAddress: string;
}