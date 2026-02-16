const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String },
    walletAddress: { type: String, sparse: true, unique: true },
    role: { type: String, enum: ['admin', 'voter'], default: 'voter', index: true },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false } // Requires admin approval before login
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
