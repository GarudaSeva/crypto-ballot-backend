const express = require('express');
const { castVote, myVotes } = require('../controllers/votesController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, castVote);
router.get('/my', authenticate, myVotes);

module.exports = router;
