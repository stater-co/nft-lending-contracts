import { Hounds } from '../../../typechain-types/Hounds';
import { Queues } from '../../../typechain-types/Queues';
import { Race, Races } from '../../../typechain-types/Races';
import { Signer } from 'ethers';


export interface RacesAdvancedTests {
    contract: Races;
    race: Race.StructStructOutput;
    hounds: Hounds;
    queues: Queues;
    signer: Signer;
}