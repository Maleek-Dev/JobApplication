const Company = require('../models/Company');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
exports.getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find().populate('owner', 'name email');
    res.status(200).json({ success: true, count: companies.length, data: companies });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Public
exports.getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate('owner', 'name email');
    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }
    res.status(200).json({ success: true, data: company });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new company
// @route   POST /api/companies
// @access  Private (Employer/Admin)
exports.createCompany = async (req, res, next) => {
  try {
    req.body.owner = req.user.id;
    const company = await Company.create(req.body);
    res.status(201).json({ success: true, data: company });
  } catch (err) {
    next(err);
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private (Owner/Admin)
exports.updateCompany = async (req, res, next) => {
  try {
    let company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }

    // Make sure user is company owner or admin
    if (company.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'User not authorized to update this company' });
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: company });
  } catch (err) {
    next(err);
  }
};
