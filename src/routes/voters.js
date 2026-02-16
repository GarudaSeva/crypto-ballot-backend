const express = require('express');
const { addVoter, listVoters, approveVoter, toggleVoterStatus } = require('../controllers/votersController');
const { authenticateOptional, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateOptional, requireAdmin, addVoter);
router.get('/', authenticateOptional, requireAdmin, listVoters);
router.patch('/:id/approve', authenticateOptional, requireAdmin, approveVoter);
router.patch('/:id/toggle-status', authenticateOptional, requireAdmin, toggleVoterStatus);

module.exports = router;
