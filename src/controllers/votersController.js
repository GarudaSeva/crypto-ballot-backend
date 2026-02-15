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

module.exports = { addVoter, listVoters };
