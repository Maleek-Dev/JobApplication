const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  filePath: {
    type: String,
    required: [true, 'Please provide a file path']
  },
  originalName: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
