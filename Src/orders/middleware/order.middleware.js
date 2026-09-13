
const validateOrder = (req, res, next) => {
  const {
    items,
    customerName,
    customerPhone,
    orderType,
    deliveryAddress,
    paymentMethod,
    notes,
  } = req.body;

  const errors = [];

  if (!Array.isArray(items) || items.length === 0) {
    errors.push("Order must contain at least one item");
  } else {
    items.forEach((item, index) => {
      if (!item || typeof item !== "object") {
        errors.push(`Item ${index + 1} is invalid`);
        return;
      }

      if (!item.menuItemId || typeof item.menuItemId !== "string") {
        errors.push(`Item ${index + 1} menuItemId is required`);
      }

      if (
        typeof item.quantity !== "number" ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        errors.push(
          `Item ${index + 1} quantity must be a positive integer`
        );
      }

      if (
        item.price !== undefined &&
        (typeof item.price !== "number" || item.price < 0)
      ) {
        errors.push(
          `Item ${index + 1} price must be a non-negative number`
        );
      }
    });
  }

  if (
    !customerName ||
    typeof customerName !== "string" ||
    !customerName.trim()
  ) {
    errors.push("Customer name is required");
  }

  if (
    !customerPhone ||
    typeof customerPhone !== "string" ||
    !customerPhone.trim()
  ) {
    errors.push("Customer phone is required");
  }

  const allowedOrderTypes = ["delivery", "pickup"];

  if (
    !orderType ||
    !allowedOrderTypes.includes(
      String(orderType).toLowerCase()
    )
  ) {
    errors.push("Order type must be delivery or pickup");
  }

  if (
    String(orderType).toLowerCase() === "delivery" &&
    (
      !deliveryAddress ||
      typeof deliveryAddress !== "string" ||
      !deliveryAddress.trim()
    )
  ) {
    errors.push("Delivery address is required");
  }

  const allowedPaymentMethods = [
    "cash",
    "card",
    "online",
    "bancontact",
  ];

  if (
    paymentMethod !== undefined &&
    !allowedPaymentMethods.includes(
      String(paymentMethod).toLowerCase()
    )
  ) {
    errors.push("Invalid payment method");
  }

  if (
    notes !== undefined &&
    typeof notes !== "string"
  ) {
    errors.push("Order notes must be text");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid order data",
      errors,
    });
  }

  req.body.customerName = customerName.trim();
  req.body.customerPhone = customerPhone.trim();
  req.body.orderType = orderType.toLowerCase();

  if (typeof deliveryAddress === "string") {
    req.body.deliveryAddress = deliveryAddress.trim();
  }

  if (typeof paymentMethod === "string") {
    req.body.paymentMethod =
      paymentMethod.trim().toLowerCase();
  }

  if (typeof notes === "string") {
    req.body.notes = notes.trim();
  }

  next();
};

const validateOrderId = (req, res, next) => {
  const { id } = req.params;

  if (!id || typeof id !== "string" || !id.trim()) {
    return res.status(400).json({
      success: false,
      message: "Valid order ID is required",
    });
  }

  next();
};

const validateOrderStatus = (req, res, next) => {
  const { status } = req.body;

  const allowedStatuses = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "out_for_delivery",
    "completed",
    "cancelled",
  ];

  if (
    !status ||
    !allowedStatuses.includes(
      String(status).toLowerCase()
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid order status",
      allowedStatuses,
    });
  }

  req.body.status = status.toLowerCase();

  next();
};

const validatePaymentStatus = (req, res, next) => {
  const { paymentStatus } = req.body;

  const allowedPaymentStatuses = [
    "pending",
    "paid",
    "failed",
    "refunded",
  ];

  if (
    !paymentStatus ||
    !allowedPaymentStatuses.includes(
      String(paymentStatus).toLowerCase()
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment status",
      allowedPaymentStatuses,
    });
  }

  req.body.paymentStatus =
    paymentStatus.toLowerCase();

  next();
};

module.exports = {
  validateOrder,
  validateOrderId,
  validateOrderStatus,
  validatePaymentStatus,
};
