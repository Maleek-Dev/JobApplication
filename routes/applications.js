const express = require('express');
const { getApplications, applyForJob, updateApplication } = require('../controllers/applications');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getApplications)
  .post(protect, authorize('seeker', 'admin'), applyForJob);

router
  .route('/:id')
  .put(protect, authorize('employer', 'recruiter', 'admin'), updateApplication);

module.exports = router;
