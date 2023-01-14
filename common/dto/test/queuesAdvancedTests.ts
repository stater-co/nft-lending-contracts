import { Arena, Arenas } from '../../../typechain-types/Arenas';
import { ethers } from 'ethers';
import { HoundracePotions } from '../../../typechain-types/HoundracePotions';
import { Hounds } from '../../../typechain-types/Hounds';
import { Payments } from '../../../typechain-types/Payments';
import { Queue, Queues } from '../../../typechain-types/Queues';
import { Races } from '../../../typechain-types/Races';

export interface QueuesAdvancedTests {
    queuesContract: Queues;
    arenasContract: Arenas;
    erc20: HoundracePotions;
    queue: Queue.StructStructOutput;
    arena: Arena.StructStructOutput;
    arenas: ethers.Contract;
    houndsContract: Hounds;
    payments: Payments
    races: Races;
}