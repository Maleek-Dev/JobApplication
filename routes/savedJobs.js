const express = require('express');
const { getSavedJobs, saveJob, unsaveJob } = require('../controllers/savedJobs');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('seeker', 'admin'), getSavedJobs)
  .post(protect, authorize('seeker', 'admin'), saveJob);

router
  .route('/:id')
  .delete(protect, authorize('seeker', 'admin'), unsaveJob);

module.exports = router;
