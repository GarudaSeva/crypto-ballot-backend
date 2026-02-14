const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchainController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, blockchainController.getBlockchain);

module.exports = router;
