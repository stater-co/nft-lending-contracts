import { Queues, QueuesConstructor } from '../../../typechain-types/Queues';
import { QueuesMethods } from '../../../typechain-types/QueuesMethods';
import { QueuesRestricted } from '../../../typechain-types/QueuesRestricted';
import { QueuesZerocost } from '../../../typechain-types/QueuesZerocost';

export interface QueuesSystemController {
    queuesRestricted: QueuesRestricted;
    queuesMethods: QueuesMethods;
    queuesZerocost: QueuesZerocost;
    queues: Queues;
    constructor: QueuesConstructor.StructStruct;
}