const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');

async function electionResults(req, res) {
  const { electionId } = req.params;
  const pipeline = [
    { $match: { election: require('mongoose').Types.ObjectId.createFromHexString(electionId) } },
    { $group: { _id: '$candidate', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ];
  const tallies = await Vote.aggregate(pipeline);
  const candidateIds = tallies.map(t => t._id);
  const candidates = await Candidate.find({ _id: { $in: candidateIds } });
  const results = tallies.map(t => ({
    candidate: candidates.find(c => c._id.equals(t._id)),
    votes: t.count
  }));
  const totalVotes = tallies.reduce((a, b) => a + b.count, 0);
  res.json({ totalVotes, results });
}

module.exports = { electionResults };
