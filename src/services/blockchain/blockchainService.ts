import type { BlockchainBlock, EnvironmentalReading } from '../../types';
import { BlockchainSimulation } from '../simulation/blockchainSimulation';

class BlockchainService {
  private blockchainSimulation: BlockchainSimulation;

  constructor() {
    this.blockchainSimulation = new BlockchainSimulation();
  }

  addEnvironmentalRecord(readings: EnvironmentalReading[]): BlockchainBlock {
    return this.blockchainSimulation.addBlock(readings);
  }

  verifyChain(): boolean {
    return this.blockchainSimulation.verifyChain();
  }

  getLatestBlock(): BlockchainBlock {
    return this.blockchainSimulation.getLatestBlock();
  }

  getChainLength(): number {
    return this.blockchainSimulation.getChainLength();
  }

  verifyData(hash: string): boolean {
    return this.blockchainSimulation.verifyData(hash);
  }
}

export const blockchainService = new BlockchainService();
