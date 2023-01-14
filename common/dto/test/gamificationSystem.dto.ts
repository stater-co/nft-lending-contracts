import { Gamification } from '../../../typechain-types/Gamification';
import { GamificationMethods } from '../../../typechain-types/GamificationMethods';
import { GamificationRestricted } from '../../../typechain-types/GamificationRestricted';


export interface GamificationSystem {
    restricted: GamificationRestricted;
    methods: GamificationMethods;
    gamification: Gamification;
}