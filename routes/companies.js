const express = require('express');
const { getCompanies, getCompany, createCompany, updateCompany } = require('../controllers/companies');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(getCompanies)
  .post(protect, authorize('employer', 'admin'), createCompany);

router
  .route('/:id')
  .get(getCompany)
  .put(protect, authorize('employer', 'admin'), updateCompany);

module.exports = router;
