const CryptoJS = require('crypto-js');
const Block = require('../models/Block');

class Blockchain {
  constructor() {
    this.difficulty = 2; // Simple proof of work
    this.pendingVotes = [];
  }

  async initialize() {
    const count = await Block.countDocuments();
    if (count === 0) {
      await this.createGenesisBlock();
    }
  }

  async createGenesisBlock() {
    const genesisBlock = {
      index: 0,
      timestamp: Date.now(),
      votes: [{ message: "Genesis Block - Secure Voting System Started" }],
      previousHash: "0",
      nonce: 0
    };
    genesisBlock.hash = this.calculateHash(genesisBlock);
    await Block.create(genesisBlock);
    console.log("Genesis Block created");
  }

  calculateHash({ index, previousHash, timestamp, votes, nonce }) {
    const normalizedVotes = JSON.stringify(votes.map(v => ({
      voteId: v.voteId || null,
      electionId: v.electionId || null,
      candidateId: v.candidateId || null,
      voterId: v.voterId || null,
      message: v.message || null
    })));

    return CryptoJS.SHA256(
      index + previousHash + timestamp + normalizedVotes + nonce
    ).toString();
  }

  async mineBlock() {
    if (this.pendingVotes.length === 0) return;

    let lastBlock = await Block.findOne().sort({ index: -1 });
    
    // If no blocks exist yet, ensure genesis is created
    if (!lastBlock) {
      await this.createGenesisBlock();
      lastBlock = await Block.findOne().sort({ index: -1 });
    }

    const newIndex = lastBlock.index + 1;
    const timestamp = Date.now();
    const previousHash = lastBlock.hash;
    
    let nonce = 0;
    let hash = "";
    
    const votesToStore = [...this.pendingVotes];
    this.pendingVotes = [];

    // Simple Proof of Work
    while (true) {
      hash = this.calculateHash({ index: newIndex, previousHash, timestamp, votes: votesToStore, nonce });
      if (hash.substring(0, this.difficulty) === Array(this.difficulty + 1).join("0")) {
        break;
      }
      nonce++;
    }

    const newBlock = await Block.create({
      index: newIndex,
      timestamp,
      votes: votesToStore,
      previousHash,
      hash,
      nonce
    });

    console.log(`Block #${newIndex} mined: ${hash}`);
    return newBlock;
  }

  addVoteToPending(voteData) {
    this.pendingVotes.push(voteData);
    // For this simple implementation, we mine a block every time a vote is cast 
    // or we could batch them. Let's batch them or mine immediately for now.
    return this.mineBlock();
  }

  async getChain() {
    return await Block.find().sort({ index: 1 });
  }

  async isValid() {
    const chain = await this.getChain();
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const previousBlock = chain[i - 1];

      if (currentBlock.hash !== this.calculateHash(currentBlock)) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

module.exports = new Blockchain();
