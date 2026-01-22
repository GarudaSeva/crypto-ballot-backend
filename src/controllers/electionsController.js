const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

async function createElection(req, res) {
  try {
    const { name, description, type, startsAt, endsAt } = req.body;
    if (!name || !startsAt || !endsAt) return res.status(400).json({ message: 'name, startsAt, endsAt required' });
    const e = await Election.create({ name, description, type, startsAt, endsAt, status: 'upcoming' });
    res.status(201).json({ election: e });
  } catch (err) {
    console.error('Create election error:', err);
    res.status(500).json({ message: 'Failed to create election', error: err.message });
  }
}

async function listElections(req, res) {
  try {
    const list = await Election.find().sort({ createdAt: -1 });
    res.json({ elections: list });
  } catch (err) {
    console.error('List elections error:', err);
    res.status(500).json({ message: 'Failed to list elections', error: err.message });
  }
}

async function getElection(req, res) {
  try {
    const { id } = req.params;
    const election = await Election.findById(id);
    if (!election) return res.status(404).json({ message: 'Election not found' });
    const candidates = await Candidate.find({ election: id }).sort({ createdAt: -1 });
    const totalVotes = await Vote.countDocuments({ election: id });
    res.json({ election, candidates, totalVotes });
  } catch (err) {
    console.error('Get election error:', err);
    res.status(500).json({ message: 'Failed to get election', error: err.message });
  }
}

async function updateElection(req, res) {
  try {
    const { id } = req.params;
    const { name, description, type, startsAt, endsAt, status } = req.body;
    const election = await Election.findByIdAndUpdate(
      id,
      { name, description, type, startsAt, endsAt, status },
      { new: true, runValidators: true }
    );
    if (!election) return res.status(404).json({ message: 'Election not found' });
    res.json({ election });
  } catch (err) {
    console.error('Update election error:', err);
    res.status(500).json({ message: 'Failed to update election', error: err.message });
  }
}

async function deleteElection(req, res) {
  try {
    const { id } = req.params;
    const election = await Election.findById(id);
    if (!election) return res.status(404).json({ message: 'Election not found' });
    
    // Check if there are votes
    const voteCount = await Vote.countDocuments({ election: id });
    if (voteCount > 0) {
      return res.status(400).json({ message: 'Cannot delete election with existing votes' });
    }
    
    // Delete candidates first
    await Candidate.deleteMany({ election: id });
    await Election.findByIdAndDelete(id);
    res.json({ message: 'Election deleted successfully' });
  } catch (err) {
    console.error('Delete election error:', err);
    res.status(500).json({ message: 'Failed to delete election', error: err.message });
  }
}

async function addCandidate(req, res) {
  try {
    const { id } = req.params; // election id
    const { name, party, symbol, manifesto, description } = req.body;
    const election = await Election.findById(id);
    if (!election) return res.status(404).json({ message: 'Election not found' });
    const c = await Candidate.create({ election: id, name, party, symbol, manifesto, description });
    res.status(201).json({ candidate: c });
  } catch (err) {
    console.error('Add candidate error:', err);
    res.status(500).json({ message: 'Failed to add candidate', error: err.message });
  }
}

async function deleteCandidate(req, res) {
  try {
    const { id, candidateId } = req.params;
    const candidate = await Candidate.findOne({ _id: candidateId, election: id });
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    
    // Check if there are votes for this candidate
    const voteCount = await Vote.countDocuments({ candidate: candidateId });
    if (voteCount > 0) {
      return res.status(400).json({ message: 'Cannot delete candidate with existing votes' });
    }
    
    await Candidate.findByIdAndDelete(candidateId);
    res.json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    console.error('Delete candidate error:', err);
    res.status(500).json({ message: 'Failed to delete candidate', error: err.message });
  }
}

async function activeElections(req, res) {
  try {
    const now = new Date();
    const list = await Election.find({ startsAt: { $lte: now }, endsAt: { $gte: now } }).sort({ startsAt: 1 });
    res.json({ elections: list });
  } catch (err) {
    console.error('Get active elections error:', err);
    res.status(500).json({ message: 'Failed to get active elections', error: err.message });
  }
}

module.exports = { createElection, listElections, getElection, updateElection, deleteElection, addCandidate, deleteCandidate, activeElections };
