import type { BlockchainBlock, EnvironmentalReading } from '../../types';

function calculateHash(
  index: number,
  timestamp: Date,
  data: EnvironmentalReading[],
  previousHash: string,
  nonce: number,
): string {
  const payload = `${index}${timestamp.toISOString()}${JSON.stringify(data)}${previousHash}${nonce}`;
  const encoded = btoa(unescape(encodeURIComponent(payload)));
  const hex = Array.from(encoded)
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
  return `0x${hex.padEnd(64, '0').slice(0, 64)}`;
}

export class BlockchainSimulation {
  blocks: BlockchainBlock[];

  constructor() {
    const genesisTimestamp = new Date('2026-01-01T00:00:00.000Z');
    const genesisHash = calculateHash(0, genesisTimestamp, [], '0', 0);
    this.blocks = [
      {
        index: 0,
        timestamp: genesisTimestamp,
        data: [],
        previousHash: '0',
        hash: genesisHash,
        nonce: 0,
        verified: true,
        validator: 'genesis-node',
      },
    ];
  }

  addBlock(data: EnvironmentalReading[]): BlockchainBlock {
    const previousBlock = this.getLatestBlock();
    const index = previousBlock.index + 1;
    const timestamp = new Date();
    let nonce = 0;
    let hash = calculateHash(index, timestamp, data, previousBlock.hash, nonce);

    while (!hash.startsWith('0000')) {
      nonce++;
      hash = calculateHash(index, timestamp, data, previousBlock.hash, nonce);
    }

    const block: BlockchainBlock = {
      index,
      timestamp,
      data,
      previousHash: previousBlock.hash,
      hash,
      nonce,
      verified: true,
      validator: `validator-${(index % 5) + 1}`,
    };

    this.blocks.push(block);
    return block;
  }

  verifyChain(): boolean {
    for (let i = 1; i < this.blocks.length; i++) {
      const current = this.blocks[i];
      const previous = this.blocks[i - 1];

      const recalculated = calculateHash(
        current.index,
        current.timestamp,
        current.data,
        current.previousHash,
        current.nonce,
      );

      if (current.hash !== recalculated) return false;
      if (current.previousHash !== previous.hash) return false;
    }
    return true;
  }

  getLatestBlock(): BlockchainBlock {
    return this.blocks[this.blocks.length - 1];
  }

  getChainLength(): number {
    return this.blocks.length;
  }

  verifyData(hash: string): boolean {
    return this.blocks.some((block) =>
      block.data.some((reading) => reading.blockchainHash === hash),
    );
  }
}
