const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema(
  {
    index: { type: Number, required: true, unique: true },
    timestamp: { type: Number, required: true },
    votes: [
      {
        voteId: { type: String },
        electionId: { type: String },
        candidateId: { type: String },
        voterId: { type: String },
        message: { type: String },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    previousHash: { type: String, required: true },
    hash: { type: String, required: true },
    nonce: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Block', blockSchema);
