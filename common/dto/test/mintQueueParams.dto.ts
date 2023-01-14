import { ethers, Signer } from "ethers";
import { Queue } from '../../../typechain-types/Queues';

export interface MintQueueParams {
    contract: ethers.Contract;
    queue: Queue.StructStructOutput;
    signer: Signer;
  }