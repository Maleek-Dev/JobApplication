const express = require('express');
const { uploadResume, getResumes, deleteResume } = require('../controllers/resumes');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('seeker', 'admin'), getResumes)
  .post(protect, authorize('seeker'), upload.single('file'), uploadResume);

router
  .route('/:id')
  .delete(protect, authorize('seeker', 'admin'), deleteResume);

module.exports = router;
