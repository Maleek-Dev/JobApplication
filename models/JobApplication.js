const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    type: mongoose.Schema.ObjectId,
    ref: 'Resume',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'reviewing', 'interview', 'rejected', 'hired'],
    default: 'applied'
  },
  coverLetter: {
    type: String
  }
}, { timestamps: true });

// Prevent user from applying to the same job more than once
jobApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
