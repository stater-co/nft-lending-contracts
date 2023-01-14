import { ethers, Signer } from "ethers";

export interface CloseQueueParams {
  contract: ethers.Contract;
  queueId: number | string;
  signer: Signer;
}