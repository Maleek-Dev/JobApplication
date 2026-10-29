const express = require('express');
const { getStats } = require('../controllers/reports');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/stats', authorize('admin', 'employer'), getStats);

module.exports = router;
