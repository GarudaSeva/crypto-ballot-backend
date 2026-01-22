const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['village', 'mla', 'mlc', 'municipal'], default: 'village' },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    status: { type: String, enum: ['upcoming', 'active', 'closed'], default: 'upcoming' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Election', electionSchema);
