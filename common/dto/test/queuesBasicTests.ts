import { ethers } from "ethers";
import { Arenas } from "../../../typechain-types/Arenas";
import { HoundracePotions } from "../../../typechain-types/HoundracePotions";
import { Payments } from "../../../typechain-types/Payments";
import { Queue, Queues } from "../../../typechain-types/Queues";

export interface QueuesBasicTests {
    contract: Queues;
    queue: Queue.StructStructOutput;
    houndIdToEnqueue: number | string;
    houndsContract: ethers.Contract;
    arenasContract: Arenas;
    erc20: HoundracePotions;
    payments: Payments;
}