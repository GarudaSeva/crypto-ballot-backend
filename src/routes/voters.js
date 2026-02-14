const express = require('express');
const { addVoter, listVoters, verifyVoter } = require('../controllers/votersController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, requireAdmin, addVoter);
router.get('/', authenticate, requireAdmin, listVoters);
router.patch('/:voterId/verify', authenticate, requireAdmin, verifyVoter);

module.exports = router;
