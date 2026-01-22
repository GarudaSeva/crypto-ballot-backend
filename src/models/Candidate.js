const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    election: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true, index: true },
    name: { type: String, required: true },
    party: { type: String },
    symbol: { type: String, default: '🌟' },
    manifesto: { type: String },
    description: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Candidate', candidateSchema);
