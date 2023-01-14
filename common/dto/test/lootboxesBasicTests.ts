import { Hounds } from "../../../typechain-types/Hounds";
import { HoundraceMysteryBoxes } from "../../../typechain-types/HoundraceMysteryBoxes";
import { Races } from "../../../typechain-types/Races";

export interface LootboxesBasicTests {
    lootboxesContract: HoundraceMysteryBoxes;
    races: Races;
    houndsContract: Hounds;
}