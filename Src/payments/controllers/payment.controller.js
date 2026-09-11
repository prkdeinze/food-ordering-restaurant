const paymentService = require("../services/payment.service");

// Create a new payment
const createPayment = async (req, res) => {
  try {
    const payment = await paymentService.createPayment(req.body);

    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: payment,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create payment",
    });
  }
};

// Get all payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();

    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to get payments",
    });
  }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentById(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to get payment",
    });
  }
};

// Get payment by order ID
const getPaymentByOrderId = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentByOrderId(
      req.params.orderId
    );

    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to get payment for order",
    });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const payment = await paymentService.updatePaymentStatus(
      req.params.id,
      req.body.status
    );

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: payment,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to update payment status",
    });
  }
};

// Mark payment as paid
const markPaymentAsPaid = async (req, res) => {
  try {
    const payment = await paymentService.markPaymentAsPaid(
      req.params.id,
      req.body.transactionId
    );

    return res.status(200).json({
      success: true,
      message: "Payment marked as paid successfully",
      data: payment,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to mark payment as paid",
    });
  }
};

// Mark payment as failed
const markPaymentAsFailed = async (req, res) => {
  try {
    const payment = await paymentService.markPaymentAsFailed(
      req.params.id,
      req.body.failureReason
    );

    return res.status(200).json({
      success: true,
      message: "Payment marked as failed",
      data: payment,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to mark payment as failed",
    });
  }
};

// Refund payment
const refundPayment = async (req, res) => {
  try {
    const payment = await paymentService.refundPayment(
      req.params.id,
      req.body.refundAmount,
      req.body.reason
    );

    return res.status(200).json({
      success: true,
      message: "Payment refunded successfully",
      data: payment,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to refund payment",
    });
  }
};

// Delete payment
const deletePayment = async (req, res) => {
  try {
    await paymentService.deletePayment(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete payment",
    });
  }
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
