const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String },
    walletAddress: { type: String, sparse: true, unique: true },
    aadhaarNumber: { type: String, unique: true, sparse: true },
    role: { type: String, enum: ['admin', 'voter'], default: 'voter', index: true },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
