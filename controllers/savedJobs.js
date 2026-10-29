const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

// @desc    Get user's saved jobs
// @route   GET /api/saved-jobs
// @access  Private (Seeker)
exports.getSavedJobs = async (req, res, next) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user.id }).populate('job');
    res.status(200).json({ success: true, count: savedJobs.length, data: savedJobs });
  } catch (err) {
    next(err);
  }
};

// @desc    Save a job
// @route   POST /api/saved-jobs
// @access  Private (Seeker)
exports.saveJob = async (req, res, next) => {
  try {
    const { job } = req.body;
    
    // Check if job exists
    const jobExists = await Job.findById(job);
    if (!jobExists) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    const savedJob = await SavedJob.create({
      user: req.user.id,
      job
    });

    res.status(201).json({ success: true, data: savedJob });
  } catch (err) {
    next(err);
  }
};

// @desc    Unsave a job
// @route   DELETE /api/saved-jobs/:id
// @access  Private (Seeker)
exports.unsaveJob = async (req, res, next) => {
  try {
    const savedJob = await SavedJob.findById(req.params.id);

    if (!savedJob) {
      return res.status(404).json({ success: false, error: 'Saved job not found' });
    }

    if (savedJob.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'User not authorized to remove this saved job' });
    }

    await savedJob.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
