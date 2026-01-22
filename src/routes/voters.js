const express = require('express');
const { addVoter, listVoters } = require('../controllers/votersController');
const { authenticateOptional, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateOptional, requireAdmin, addVoter);
router.get('/', authenticateOptional, requireAdmin, listVoters);

module.exports = router;
