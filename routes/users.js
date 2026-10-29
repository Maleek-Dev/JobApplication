const express = require('express');
const { getUsers } = require('../controllers/users');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin')); // All user routes require admin role

router.route('/').get(getUsers);

module.exports = router;
