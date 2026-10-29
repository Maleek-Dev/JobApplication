const Interview = require('../models/Interview');
const JobApplication = require('../models/JobApplication');
const Notification = require('../models/Notification');

// @desc    Get interviews
// @route   GET /api/interviews
// @access  Private
exports.getInterviews = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === 'seeker') {
      // Find applications for this seeker, then find interviews for those apps
      const apps = await JobApplication.find({ applicant: req.user.id }).select('_id');
      const appIds = apps.map(a => a._id);
      
      query = Interview.find({ application: { $in: appIds } }).populate({
        path: 'application',
        populate: { path: 'job', select: 'title company' }
      });
    } else if (req.user.role === 'employer' || req.user.role === 'recruiter') {
      // Interviews scheduled by this user
      query = Interview.find({ interviewer: req.user.id }).populate({
        path: 'application',
        populate: { path: 'applicant', select: 'name email' }
      });
    } else if (req.user.role === 'admin') {
      query = Interview.find();
    }

    const interviews = await query;
    res.status(200).json({ success: true, count: interviews.length, data: interviews });
  } catch (err) {
    next(err);
  }
};

// @desc    Schedule interview
// @route   POST /api/interviews
// @access  Private (Employer/Recruiter/Admin)
exports.scheduleInterview = async (req, res, next) => {
  try {
    req.body.interviewer = req.user.id;
    
    const application = await JobApplication.findById(req.body.application);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    const interview = await Interview.create(req.body);

    // Update application status to interview
    application.status = 'interview';
    await application.save();

    await Notification.create({
      user: application.applicant,
      message: `An interview has been scheduled for your application.`,
      type: 'interview_scheduled'
    });

    res.status(201).json({ success: true, data: interview });
  } catch (err) {
    next(err);
  }
};

// @desc    Update interview status/details
// @route   PUT /api/interviews/:id
// @access  Private (Employer/Recruiter/Admin)
exports.updateInterview = async (req, res, next) => {
  try {
    let interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ success: false, error: 'Interview not found' });
    }

    if (interview.interviewer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'User not authorized to update this interview' });
    }

    interview = await Interview.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: interview });
  } catch (err) {
    next(err);
  }
};
