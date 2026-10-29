const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const User = require('../models/User');

// @desc    Get platform statistics (Admin) or employer stats (Employer)
// @route   GET /api/reports/stats
// @access  Private (Admin/Employer)
exports.getStats = async (req, res, next) => {
  try {
    let stats = {};

    if (req.user.role === 'admin') {
      // Platform-wide stats
      const totalUsers = await User.countDocuments();
      const totalJobs = await Job.countDocuments();
      const totalApplications = await JobApplication.countDocuments();

      stats = { totalUsers, totalJobs, totalApplications };
    } else if (req.user.role === 'employer') {
      // Employer-specific stats
      const totalJobs = await Job.countDocuments({ employer: req.user.id });
      
      // Get all jobs for this employer to count applications
      const jobs = await Job.find({ employer: req.user.id }).select('_id');
      const jobIds = jobs.map(j => j._id);
      
      const totalApplications = await JobApplication.countDocuments({ job: { $in: jobIds } });

      stats = { totalJobs, totalApplications };
    }

    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};
