import { ethers, Signer } from "ethers";
import { Arena } from '../../../typechain-types/Arenas';

export interface EditArenaParams {
    contract: ethers.Contract;
    arena: Arena.StructStructOutput;
    arenaId: string | number;
    signer: Signer;
  }