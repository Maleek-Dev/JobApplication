const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title']
  },
  description: {
    type: String,
    required: [true, 'Please add a job description']
  },
  requirements: {
    type: [String],
    required: [true, 'Please add job requirements']
  },
  salaryRange: {
    type: String,
    required: [true, 'Please add a salary range']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true
  },
  employer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
