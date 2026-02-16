const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function login(req, res) {
  const { email, password, walletAddress } = req.body;
  
  // Wallet-based login
  if (walletAddress) {
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    // User must exist (be registered) before they can login
    if (!user) {
      return res.status(401).json({ message: 'Wallet not registered. Please sign up first.' });
    }
    
    // Check if user is approved by admin
    if (!user.isApproved) {
      return res.status(403).json({ message: 'Your account is pending admin approval.' });
    }
    
    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account disabled' });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, walletAddress: user.walletAddress } });
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

async function signup(req, res) {
  const { name, email, walletAddress } = req.body;
  
  if (!walletAddress) {
    return res.status(400).json({ message: 'Wallet address is required' });
  }
  
  // Check if wallet already exists
  const existingUser = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ message: 'Wallet address already registered' });
  }
  
  // Create user in pending state (isApproved: false)
  const user = await User.create({
    name: name || `Voter ${walletAddress.slice(0, 6)}`,
    email: email || `${walletAddress.toLowerCase()}@wallet.local`,
    walletAddress: walletAddress.toLowerCase(),
    role: 'voter',
    isApproved: false // Pending admin approval
  });
  
  return res.status(201).json({ 
    message: 'Signup successful. Please wait for admin approval before logging in.',
    user: { 
      id: user._id, 
      name: user.name, 
      walletAddress: user.walletAddress,
      isApproved: user.isApproved 
    } 
  });
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

module.exports = { login, signup, me };
