const express = require('express');
const { getFounderAnalytics, getUserAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/founder', protect, authorize('founder', 'admin'), getFounderAnalytics);
router.get('/user', protect, getUserAnalytics);

module.exports = router;
