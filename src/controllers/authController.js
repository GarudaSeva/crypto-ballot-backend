const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function login(req, res) {
  const { email, password, walletAddress } = req.body;
  
  // Wallet-based login with Aadhaar verification
  if (walletAddress) {
    const { aadhaarNumber, name } = req.body;
    
    let user = await User.findOne({ 
      $or: [
        { walletAddress: walletAddress.toLowerCase() },
        { aadhaarNumber: aadhaarNumber }
      ]
    });

    if (!user) {
      if (!name) return res.status(404).json({ message: 'Account not found. Please register first.' });
      if (!aadhaarNumber) return res.status(400).json({ message: 'Aadhaar number required for registration' });

      // Check if Aadhaar is already taken (safety check)
      const aadhaarExists = await User.findOne({ aadhaarNumber });
      if (aadhaarExists) return res.status(409).json({ message: 'This Aadhaar number is already registered with another wallet.' });

      // Auto-register voter with wallet and Aadhaar
      user = await User.create({ 
        name: name,
        email: `${walletAddress.toLowerCase()}@wallet.local`,
        walletAddress: walletAddress.toLowerCase(),
        aadhaarNumber: aadhaarNumber,
        role: 'voter',
        isVerified: false // Needs admin approval
      });
      return res.status(403).json({ message: 'Registration submitted. Please wait for admin approval.' });
    }

    // Verify wallet and Aadhaar correlation
    if (user.walletAddress !== walletAddress.toLowerCase()) {
      return res.status(401).json({ message: 'This wallet is not linked to this account' });
    }

    if (aadhaarNumber && user.aadhaarNumber !== aadhaarNumber) {
      return res.status(401).json({ message: 'Incorrect Aadhaar number for this wallet' });
    }

    if (!user.isActive) return res.status(403).json({ message: 'Account disabled' });
    if (!user.isVerified) return res.status(403).json({ message: 'Registration pending admin approval' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    return res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        walletAddress: user.walletAddress,
        aadhaarNumber: user.aadhaarNumber,
        isVerified: user.isVerified
      } 
    });
  }

  // Admin login via environment variables (no database)
  if (email && password) {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@crypto.local').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    // Check if email and password match environment variables
    if (email.toLowerCase() === adminEmail && password === adminPassword) {
      const adminName = process.env.ADMIN_NAME || 'Super Admin';
      const token = jwt.sign({ id: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
      return res.json({ 
        token, 
        user: { 
          id: 'admin', 
          name: adminName, 
          email: adminEmail, 
          role: 'admin' 
        } 
      });
    }
    
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.status(400).json({ message: 'Email and password or wallet address required' });
}

async function me(req, res) {
  // If it's admin user from environment
  if (req.user.id === 'admin' && req.user.role === 'admin') {
    return res.json({ 
      user: { 
        id: 'admin', 
        name: process.env.ADMIN_NAME || 'Super Admin',
        email: process.env.ADMIN_EMAIL || 'admin@crypto.local',
        role: 'admin'
      } 
    });
  }

  // Regular voter from database
  const user = await User.findById(req.user.id).select('-passwordHash');
  res.json({ user });
}

module.exports = { login, me };
