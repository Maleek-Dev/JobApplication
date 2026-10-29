const Resume = require('../models/Resume');
const fs = require('fs');

// @desc    Upload a resume
// @route   POST /api/resumes
// @access  Private (Seeker)
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a file' });
    }

    const resume = await Resume.create({
      user: req.user.id,
      filePath: req.file.path,
      originalName: req.file.originalname
    });

    res.status(201).json({ success: true, data: resume });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's resumes
// @route   GET /api/resumes
// @access  Private (Seeker)
exports.getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user.id });
    res.status(200).json({ success: true, count: resumes.length, data: resumes });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private (Seeker)
exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    // Make sure user owns resume
    if (resume.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'User not authorized to delete this resume' });
    }

    // Delete from filesystem
    if (fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }

    await resume.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
