const express = require('express');
const { getInterviews, scheduleInterview, updateInterview } = require('../controllers/interviews');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getInterviews)
  .post(protect, authorize('employer', 'recruiter', 'admin'), scheduleInterview);

router
  .route('/:id')
  .put(protect, authorize('employer', 'recruiter', 'admin'), updateInterview);

module.exports = router;
