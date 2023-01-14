import { Signer } from "ethers";
import { Queue, Queues } from "../../../typechain-types/Queues";

export interface EditQueueParams {
  contract: Queues;
  queue: Queue.StructStructOutput;
  queueId: number | string;
  signer: Signer;
}