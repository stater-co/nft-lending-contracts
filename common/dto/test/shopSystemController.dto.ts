import { Shop, ShopConstructor } from '../../../typechain-types/Shop';
import { ShopMethods } from '../../../typechain-types/ShopMethods';
import { ShopRestricted } from '../../../typechain-types/ShopRestricted';
import { ShopZerocost } from '../../../typechain-types/ShopZerocost';

export interface ShopSystemController {
    shopRestricted: ShopRestricted;
    shopMethods: ShopMethods;
    shopZerocost: ShopZerocost;
    shop: Shop;
    constructor: ShopConstructor.StructStruct;
    houndsAddress: string;
}