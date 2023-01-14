import { Hounds } from "../../../typechain-types/Hounds";
import { HoundPotions } from '../../../typechain-types/HoundPotions';
import { Races } from "../../../typechain-types/Races";
import { Payments } from '../../../typechain-types/Payments';
import { Shop } from "../../../typechain-types/Shop";
import { TestingErc1155 } from '../../../typechain-types/TestingErc1155';

export interface HoundsAdvancedTests {
    hounds: Hounds;
    erc20: HoundPotions;
    erc1155: TestingErc1155;
    payments: Payments;
    races: Races;
    shops: Shop;
}