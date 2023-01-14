import { ethers } from "ethers";

export interface UnenqueueParams {
  contract: ethers.Contract;
  queueId: string | number;
  houndId: string | number;
}