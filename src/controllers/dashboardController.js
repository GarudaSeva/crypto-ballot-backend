const User = require('../models/User');
const Election = require('../models/Election');
const Vote = require('../models/Vote');

async function dashboardStats(req, res) {
  const [voters, elections, votes] = await Promise.all([
    User.countDocuments({ role: 'voter' }),
    Election.countDocuments(),
    Vote.countDocuments()
  ]);
  res.json({ voters, elections, votes });
}

module.exports = { dashboardStats };
