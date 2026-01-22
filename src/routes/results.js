const express = require('express');
const { electionResults } = require('../controllers/resultsController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Results can be public or protected. Keeping protected for now.
router.get('/:electionId', authenticate, electionResults);

module.exports = router;
