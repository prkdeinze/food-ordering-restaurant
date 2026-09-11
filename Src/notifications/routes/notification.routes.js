const express = require("express");

const {
  createNotification,
  getAllNotifications,
  getNotificationById,
  getNotificationsByUserId,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} = require("../controllers/notification.controller");

const {
  validateNotification,
  validateNotificationId,
  validateUserId,
} = require("../middleware/notification.middleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Notification Routes
|--------------------------------------------------------------------------
*/

// Create a notification
router.post(
  "/",
  validateNotification,
  createNotification
);

// Get all notifications
router.get(
  "/",
  getAllNotifications
);

// Get all notifications for one user
router.get(
  "/user/:userId",
  validateUserId,
  getNotificationsByUserId
);

// Mark all notifications as read for one user
router.patch(
  "/user/:userId/read-all",
  validateUserId,
  markAllNotificationsAsRead
);

// Get one notification by ID
router.get(
  "/:id",
  validateNotificationId,
  getNotificationById
);

// Mark one notification as read
router.patch(
  "/:id/read",
  validateNotificationId,
  markNotificationAsRead
);

// Delete notification
router.delete(
  "/:id",
  validateNotificationId,
  deleteNotification
);

module.exports = router;
