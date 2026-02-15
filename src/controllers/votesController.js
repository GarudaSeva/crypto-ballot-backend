const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

async function castVote(req, res) {
  // Only voters can cast votes, not admins
  if (req.user.id === 'admin' || req.user.role === 'admin') {
    return res.status(403).json({ message: 'Admins cannot vote' });
  }

  const { electionId, candidateId } = req.body;
  if (!electionId || !candidateId) return res.status(400).json({ message: 'electionId and candidateId required' });

  const election = await Election.findById(electionId);
  if (!election) return res.status(404).json({ message: 'Election not found' });
  const now = new Date();
  if (now < election.startsAt || now > election.endsAt) return res.status(400).json({ message: 'Voting not active' });

  const candidate = await Candidate.findOne({ _id: candidateId, election: electionId });
  if (!candidate) return res.status(400).json({ message: 'Candidate not in this election' });

  try {
    const vote = await Vote.create({ election: electionId, candidate: candidateId, voter: req.user.id });
    res.status(201).json({ voteId: vote._id });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Already voted in this election' });
    throw err;
  }
}

async function myVotes(req, res) {
  // Only voters can see their votes
  if (req.user.id === 'admin' || req.user.role === 'admin') {
    return res.json({ votes: [] });
  }

  const votes = await Vote.find({ voter: req.user.id }).populate('election candidate');
  res.json({ votes });
}

module.exports = { castVote, myVotes };
