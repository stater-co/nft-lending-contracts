import { Signer } from "ethers";
import { Arena, Arenas } from '../../../typechain-types/Arenas';


export interface MintArenaParams {
    contract: Arenas;
    arena: Arena.StructStructOutput;
    signer: Signer;
  }