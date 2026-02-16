const bcrypt = require('bcrypt');
const User = require('../models/User');

async function addVoter(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, password required' });
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ message: 'Email already exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  const voter = await User.create({ name, email: email.toLowerCase(), passwordHash, role: 'voter' });
  res.status(201).json({ id: voter._id, name: voter.name, email: voter.email });
}

async function listVoters(req, res) {
  const voters = await User.find({ role: 'voter' }).select('-passwordHash');
  res.json({ voters });
}

async function approveVoter(req, res) {
  const { id } = req.params;
  const voter = await User.findById(id);
  
  if (!voter) {
    return res.status(404).json({ message: 'Voter not found' });
  }
  
  if (voter.role !== 'voter') {
    return res.status(400).json({ message: 'Can only approve voters' });
  }
  
  voter.isApproved = true;
  await voter.save();
  
  res.json({ message: 'Voter approved successfully', voter: { id: voter._id, name: voter.name, email: voter.email, isApproved: voter.isApproved } });
}

async function toggleVoterStatus(req, res) {
  const { id } = req.params;
  const voter = await User.findById(id);
  
  if (!voter) {
    return res.status(404).json({ message: 'Voter not found' });
  }
  
  if (voter.role !== 'voter') {
    return res.status(400).json({ message: 'Can only toggle voter status' });
  }
  
  voter.isActive = !voter.isActive;
  await voter.save();
  
  res.json({ message: `Voter ${voter.isActive ? 'activated' : 'deactivated'} successfully`, voter: { id: voter._id, name: voter.name, email: voter.email, isActive: voter.isActive } });
}

module.exports = { addVoter, listVoters, approveVoter, toggleVoterStatus };
