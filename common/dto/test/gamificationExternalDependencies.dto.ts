import { HoundBreeding, HoundStamina } from '../../../typechain-types/Gamification';


export interface GamificationExternalDependencies {
    allowed: Array<string>,
    defaultBreeding: HoundBreeding.StructStruct,
    defaultStamina: HoundStamina.StructStruct
}