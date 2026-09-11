const validateNotification = (req, res, next) => {
  const {
    userId,
    title,
    message,
    type,
    orderId,
  } = req.body;

  const errors = [];

  if (
    !userId ||
    typeof userId !== "string" ||
    !userId.trim()
  ) {
    errors.push("Valid user ID is required");
  }

  if (
    !title ||
    typeof title !== "string" ||
    !title.trim()
  ) {
    errors.push("Notification title is required");
  }

  if (
    !message ||
    typeof message !== "string" ||
    !message.trim()
  ) {
    errors.push("Notification message is required");
  }

  const allowedTypes = [
    "order",
    "payment",
    "delivery",
    "promotion",
    "system",
    "general",
  ];

  if (
    type !== undefined &&
    !allowedTypes.includes(
      String(type).toLowerCase()
    )
  ) {
    errors.push("Invalid notification type");
  }

  if (
    orderId !== undefined &&
    (
      typeof orderId !== "string" ||
      !orderId.trim()
    )
  ) {
    errors.push("Invalid order ID");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid notification data",
      errors,
    });
  }

  req.body.userId = userId.trim();
  req.body.title = title.trim();
  req.body.message = message.trim();

  if (typeof type === "string") {
    req.body.type = type.trim().toLowerCase();
  }

  if (typeof orderId === "string") {
    req.body.orderId = orderId.trim();
  }

  next();
};

const validateNotificationId = (
  req,
  res,
  next
) => {
  const { id } = req.params;

  if (
    !id ||
    typeof id !== "string" ||
    !id.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid notification ID is required",
    });
  }

  next();
};

const validateUserId = (req, res, next) => {
  const { userId } = req.params;

  if (
    !userId ||
    typeof userId !== "string" ||
    !userId.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid user ID is required",
    });
  }

  next();
};

module.exports = {
  validateNotification,
  validateNotificationId,
  validateUserId,
};
