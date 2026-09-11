const PaymentModel = require("../models/payment.model");

const payments = new Map();

const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Create a new payment
const createPayment = async (data = {}) => {
  if (!data.orderId) {
    throw createError("Order ID is required", 400);
  }

  if (
    typeof data.amount !== "number" ||
    data.amount <= 0
  ) {
    throw createError(
      "Payment amount must be greater than zero",
      400
    );
  }

  if (!data.paymentMethod) {
    throw createError(
      "Payment method is required",
      400
    );
  }

  const existingPayment = Array.from(
    payments.values()
  ).find(
    (payment) =>
      payment.orderId === data.orderId &&
      !["failed", "cancelled"].includes(
        payment.status
      )
  );

  if (existingPayment) {
    throw createError(
      "An active payment already exists for this order",
      409
    );
  }

  const payment = new PaymentModel(data);

  payments.set(payment.id, payment);

  return payment.toJSON();
};

// Get all payments
const getAllPayments = async () => {
  return Array.from(payments.values())
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .map((payment) => payment.toJSON());
};

// Get payment by payment ID
const getPaymentById = async (id) => {
  const payment = payments.get(id);

  if (!payment) {
    throw createError(
      "Payment not found",
      404
    );
  }

  return payment.toJSON();
};

// Get payment by order ID
const getPaymentByOrderId = async (orderId) => {
  const payment = Array.from(
    payments.values()
  ).find(
    (item) => item.orderId === orderId
  );

  if (!payment) {
    throw createError(
      "Payment for this order was not found",
      404
    );
  }

  return payment.toJSON();
};

// Update payment status
const updatePaymentStatus = async (
  id,
  status
) => {
  const payment = payments.get(id);

  if (!payment) {
    throw createError(
      "Payment not found",
      404
    );
  }

  try {
    payment.updateStatus(status);
  } catch (error) {
    throw createError(
      error.message || "Invalid payment status",
      400
    );
  }

  payments.set(payment.id, payment);

  return payment.toJSON();
};

// Mark payment as paid
const markPaymentAsPaid = async (
  id,
  transactionId = null
) => {
  const payment = payments.get(id);

  if (!payment) {
    throw createError(
      "Payment not found",
      404
    );
  }

  try {
    payment.markAsPaid(transactionId);
  } catch (error) {
    throw createError(
      error.message ||
        "Payment cannot be marked as paid",
      400
    );
  }

  payments.set(payment.id, payment);

  return payment.toJSON();
};

// Mark payment as failed
const markPaymentAsFailed = async (
  id,
  failureReason = ""
) => {
  const payment = payments.get(id);

  if (!payment) {
    throw createError(
      "Payment not found",
      404
    );
  }

  try {
    payment.markAsFailed(failureReason);
  } catch (error) {
    throw createError(
      error.message ||
        "Payment cannot be marked as failed",
      400
    );
  }

  payments.set(payment.id, payment);

  return payment.toJSON();
};

// Refund payment
const refundPayment = async (
  id,
  refundAmount,
  reason = ""
) => {
  const payment = payments.get(id);

  if (!payment) {
    throw createError(
      "Payment not found",
      404
    );
  }

  try {
    payment.refund(
      refundAmount,
      reason
    );
  } catch (error) {
    throw createError(
      error.message ||
        "Payment could not be refunded",
      400
    );
  }

  payments.set(payment.id, payment);

  return payment.toJSON();
};

// Delete payment
const deletePayment = async (id) => {
  const payment = payments.get(id);

  if (!payment) {
    throw createError(
      "Payment not found",
      404
    );
  }

  if (payment.status === "paid") {
    throw createError(
      "Paid payment cannot be deleted",
      400
    );
  }

  payments.delete(id);

  return true;
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentByOrderId,
  updatePaymentStatus,
  markPaymentAsPaid,
  markPaymentAsFailed,
  refundPayment,
  deletePayment,
};
