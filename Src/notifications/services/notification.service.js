const NotificationModel = require("../models/notification.model");

const notifications = new Map();

const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Create notification
const createNotification = async (data = {}) => {
  if (!data.userId) {
    throw createError("User ID is required", 400);
  }

  if (!data.title) {
    throw createError("Notification title is required", 400);
  }

  if (!data.message) {
    throw createError("Notification message is required", 400);
  }

  const notification = new NotificationModel(data);

  notifications.set(notification.id, notification);

  return notification.toJSON();
};

// Get all notifications
const getAllNotifications = async () => {
  return Array.from(notifications.values())
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .map((notification) => notification.toJSON());
};

// Get one notification by ID
const getNotificationById = async (id) => {
  const notification = notifications.get(id);

  if (!notification) {
    throw createError("Notification not found", 404);
  }

  return notification.toJSON();
};

// Get notifications by user ID
const getNotificationsByUserId = async (userId) => {
  const userNotifications = Array.from(
    notifications.values()
  )
    .filter(
      (notification) =>
        notification.userId === userId
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

  return userNotifications.map((notification) =>
    notification.toJSON()
  );
};

// Mark one notification as read
const markNotificationAsRead = async (id) => {
  const notification = notifications.get(id);

  if (!notification) {
    throw createError("Notification not found", 404);
  }

  notification.markAsRead();

  notifications.set(
    notification.id,
    notification
  );

  return notification.toJSON();
};

// Mark all notifications as read for one user
const markAllNotificationsAsRead = async (
  userId
) => {
  const userNotifications = Array.from(
    notifications.values()
  ).filter(
    (notification) =>
      notification.userId === userId
  );

  if (userNotifications.length === 0) {
    return [];
  }

  userNotifications.forEach((notification) => {
    notification.markAsRead();

    notifications.set(
      notification.id,
      notification
    );
  });

  return userNotifications.map((notification) =>
    notification.toJSON()
  );
};

// Delete notification
const deleteNotification = async (id) => {
  const notification = notifications.get(id);

  if (!notification) {
    throw createError("Notification not found", 404);
  }

  notifications.delete(id);

  return true;
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
