const express = require('express');
const { dashboardStats } = require('../controllers/dashboardController');
const { authenticateOptional, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateOptional, requireAdmin, dashboardStats);

module.exports = router;
