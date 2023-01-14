import { HoundsRestricted } from '../../../typechain-types/HoundsRestricted';
import { HoundsMinter } from '../../../typechain-types/HoundsMinter';
import { HoundsModifier } from '../../../typechain-types/HoundsModifier';
import { Hounds } from '../../../typechain-types/Hounds';
import { HoundsZerocost } from '../../../typechain-types/HoundsZerocost';

export interface HoundsSystem {
    houndsRestricted: HoundsRestricted;
    houndsModifier: HoundsModifier;
    houndsZerocost: HoundsZerocost;
    houndsMinter: HoundsMinter;
    hounds: Hounds;
}