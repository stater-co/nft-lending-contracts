import { QueuesRestricted } from '../../../typechain-types/QueuesRestricted';
import { QueuesMethods } from '../../../typechain-types/QueuesMethods';
import { Queues } from '../../../typechain-types/Queues';
import { QueuesZerocost } from '../../../typechain-types/QueuesZerocost';

export interface QueuesSystem {
    queuesRestricted: QueuesRestricted;
    queueMethods: QueuesMethods;
    queueZerocost: QueuesZerocost;
    queues: Queues;
}