const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

// @desc    Get applications for a job (Employer/Recruiter) or for current user (Seeker)
// @route   GET /api/applications
// @access  Private
exports.getApplications = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === 'seeker') {
      // Job seeker gets their own applications
      query = JobApplication.find({ applicant: req.user.id }).populate('job', 'title location');
    } else if (req.user.role === 'employer' || req.user.role === 'recruiter') {
      // Find jobs owned by this employer/recruiter
      const jobs = await Job.find({ employer: req.user.id }).select('_id');
      const jobIds = jobs.map(j => j._id);
      
      query = JobApplication.find({ job: { $in: jobIds } })
        .populate('job', 'title')
        .populate('applicant', 'name email');
    } else if (req.user.role === 'admin') {
      query = JobApplication.find();
    }

    const applications = await query;
    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (err) {
    next(err);
  }
};

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Seeker)
exports.applyForJob = async (req, res, next) => {
  try {
    req.body.applicant = req.user.id;

    // Check if job exists
    const job = await Job.findById(req.body.job);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    const application = await JobApplication.create(req.body);
    res.status(201).json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private (Employer/Recruiter/Admin)
exports.updateApplication = async (req, res, next) => {
  try {
    let application = await JobApplication.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    // Verify ownership of the job
    if (application.job.employer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'User not authorized to update this application' });
    }

    application = await JobApplication.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (req.body.status) {
      await Notification.create({
        user: application.applicant,
        message: `Your application status for ${application.job.title} has been updated to: ${application.status}`,
        type: 'application_update'
      });
    }

    res.status(200).json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};
