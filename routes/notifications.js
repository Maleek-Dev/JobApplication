const express = require('express');
const { getNotifications, markAsRead, createNotification } = require('../controllers/notifications');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getNotifications)
  .post(authorize('admin'), createNotification);

router
  .route('/:id/read')
  .put(markAsRead);

module.exports = router;
