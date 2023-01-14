import { Gamification, Constructor } from '../../../typechain-types/Gamification';
import { GamificationRestricted } from '../../../typechain-types/GamificationRestricted';
import { GamificationMethods } from '../../../typechain-types/GamificationMethods';


export interface GamificationSystemController {
    restricted: GamificationRestricted;
    methods: GamificationMethods;
    gamification: Gamification;
    constructor: Constructor.StructStruct;
}