const express = require('express');
const { createElection, listElections, getElection, updateElection, deleteElection, addCandidate, deleteCandidate, activeElections } = require('../controllers/electionsController');
const { authenticateOptional, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateOptional, requireAdmin, createElection);
router.get('/', authenticateOptional, listElections);
router.get('/active', authenticateOptional, activeElections);
router.get('/:id', authenticateOptional, getElection);
router.put('/:id', authenticateOptional, requireAdmin, updateElection);
router.delete('/:id', authenticateOptional, requireAdmin, deleteElection);
router.post('/:id/candidates', authenticateOptional, requireAdmin, addCandidate);
router.delete('/:id/candidates/:candidateId', authenticateOptional, requireAdmin, deleteCandidate);

module.exports = router;
