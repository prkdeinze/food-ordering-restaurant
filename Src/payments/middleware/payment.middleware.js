const validatePayment = (req, res, next) => {
  const {
    orderId,
    amount,
    paymentMethod,
    currency,
  } = req.body;

  const errors = [];

  if (
    !orderId ||
    typeof orderId !== "string" ||
    !orderId.trim()
  ) {
    errors.push("Valid order ID is required");
  }

  if (
    amount === undefined ||
    typeof amount !== "number" ||
    amount <= 0
  ) {
    errors.push(
      "Payment amount must be a positive number"
    );
  }

  const allowedPaymentMethods = [
    "cash",
    "card",
    "online",
    "bancontact",
    "paypal",
    "belfius",
  ];

  if (
    !paymentMethod ||
    !allowedPaymentMethods.includes(
      String(paymentMethod).toLowerCase()
    )
  ) {
    errors.push("Invalid payment method");
  }

  if (
    currency !== undefined &&
    (
      typeof currency !== "string" ||
      currency.trim().length !== 3
    )
  ) {
    errors.push(
      "Currency must be a valid 3-letter code"
    );
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment data",
      errors,
    });
  }

  req.body.orderId = orderId.trim();

  req.body.paymentMethod =
    paymentMethod.trim().toLowerCase();

  req.body.currency =
    typeof currency === "string"
      ? currency.trim().toUpperCase()
      : "EUR";

  next();
};

const validatePaymentId = (req, res, next) => {
  const { id } = req.params;

  if (
    !id ||
    typeof id !== "string" ||
    !id.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid payment ID is required",
    });
  }

  next();
};

const validateOrderId = (req, res, next) => {
  const { orderId } = req.params;

  if (
    !orderId ||
    typeof orderId !== "string" ||
    !orderId.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid order ID is required",
    });
  }

  next();
};

const validatePaymentStatus = (
  req,
  res,
  next
) => {
  const { status } = req.body;

  const allowedStatuses = [
    "pending",
    "processing",
    "paid",
    "failed",
    "refunded",
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
      message: "Invalid payment status",
      allowedStatuses,
    });
  }

  req.body.status =
    status.trim().toLowerCase();

  next();
};

const validatePaidPayment = (
  req,
  res,
  next
) => {
  const { transactionId } = req.body;

  if (
    transactionId !== undefined &&
    (
      typeof transactionId !== "string" ||
      !transactionId.trim()
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid transaction ID",
    });
  }

  if (typeof transactionId === "string") {
    req.body.transactionId =
      transactionId.trim();
  }

  next();
};

const validateFailedPayment = (
  req,
  res,
  next
) => {
  const { failureReason } = req.body;

  if (
    failureReason !== undefined &&
    typeof failureReason !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Failure reason must be text",
    });
  }

  if (typeof failureReason === "string") {
    req.body.failureReason =
      failureReason.trim();
  }

  next();
};

const validateRefund = (req, res, next) => {
  const {
    refundAmount,
    reason,
  } = req.body;

  if (
    refundAmount === undefined ||
    typeof refundAmount !== "number" ||
    refundAmount <= 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Refund amount must be a positive number",
    });
  }

  if (
    reason !== undefined &&
    typeof reason !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Refund reason must be text",
    });
  }

  if (typeof reason === "string") {
    req.body.reason = reason.trim();
  }

  next();
};

module.exports = {
  validatePayment,
  validatePaymentId,
  validateOrderId,
  validatePaymentStatus,
  validatePaidPayment,
  validateFailedPayment,
  validateRefund,
};
