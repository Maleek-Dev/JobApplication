const express = require('express');
const { getJobs, getJob, createJob, updateJob } = require('../controllers/jobs');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(getJobs)
  .post(protect, authorize('employer', 'recruiter', 'admin'), createJob);

router
  .route('/:id')
  .get(getJob)
  .put(protect, authorize('employer', 'recruiter', 'admin'), updateJob);

module.exports = router;
