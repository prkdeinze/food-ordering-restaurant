const notificationService = require("../services/notification.service");

// Create a notification
const createNotification = async (req, res) => {
  try {
    const notification =
      await notificationService.createNotification(req.body);

    return res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: notification,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to create notification",
    });
  }
};

// Get all notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications =
      await notificationService.getAllNotifications();

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to get notifications",
    });
  }
};

// Get one notification by ID
const getNotificationById = async (req, res) => {
  try {
    const notification =
      await notificationService.getNotificationById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to get notification",
    });
  }
};

// Get notifications by user ID
const getNotificationsByUserId = async (
  req,
  res
) => {
  try {
    const notifications =
      await notificationService.getNotificationsByUserId(
        req.params.userId
      );

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to get user notifications",
    });
  }
};

// Mark notification as read
const markNotificationAsRead = async (
  req,
  res
) => {
  try {
    const notification =
      await notificationService.markNotificationAsRead(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to mark notification as read",
    });
  }
};

// Mark all notifications as read for a user
const markAllNotificationsAsRead = async (
  req,
  res
) => {
  try {
    const notifications =
      await notificationService.markAllNotificationsAsRead(
        req.params.userId
      );

    return res.status(200).json({
      success: true,
      message:
        "All notifications marked as read",
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to mark notifications as read",
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    await notificationService.deleteNotification(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to delete notification",
    });
  }
};

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationById,
  getNotificationsByUserId,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};
