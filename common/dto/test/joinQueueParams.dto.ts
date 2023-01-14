import { Signer } from "ethers";
import { Arenas } from "../../../typechain-types/Arenas";
import { HoundracePotions } from "../../../typechain-types/HoundracePotions";
import { Hounds } from "../../../typechain-types/Hounds";
import { Payments } from "../../../typechain-types/Payments";
import { Queues } from "../../../typechain-types/Queues";

export interface JoinQueueParams {
    contract: Queues;
    queueId: string | number;
    houndId: string | number;
    houndsContract: Hounds;
    arenasContract: Arenas;
    sender: Signer;
    erc20: HoundracePotions;
    paymentsContract: Payments;
  }