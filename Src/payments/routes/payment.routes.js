const express = require("express");

const {
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentByOrderId,
  updatePaymentStatus,
  markPaymentAsPaid,
  markPaymentAsFailed,
  refundPayment,
  deletePayment,
} = require("../controllers/payment.controller");

const {
  validatePayment,
  validatePaymentId,
  validateOrderId,
  validatePaymentStatus,
  validatePaidPayment,
  validateFailedPayment,
  validateRefund,
} = require("../middleware/payment.middleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Payment Routes
|--------------------------------------------------------------------------
*/

// Create a new payment
router.post(
  "/",
  validatePayment,
  createPayment
);

// Get all payments
router.get(
  "/",
  getAllPayments
);

// Get payment by order ID
router.get(
  "/order/:orderId",
  validateOrderId,
  getPaymentByOrderId
);

// Get payment by payment ID
router.get(
  "/:id",
  validatePaymentId,
  getPaymentById
);

// Update payment status
router.patch(
  "/:id/status",
  validatePaymentId,
  validatePaymentStatus,
  updatePaymentStatus
);

// Mark payment as paid
router.patch(
  "/:id/paid",
  validatePaymentId,
  validatePaidPayment,
  markPaymentAsPaid
);

// Mark payment as failed
router.patch(
  "/:id/failed",
  validatePaymentId,
  validateFailedPayment,
  markPaymentAsFailed
);

// Refund payment
router.patch(
  "/:id/refund",
  validatePaymentId,
  validateRefund,
  refundPayment
);

// Delete payment
router.delete(
  "/:id",
  validatePaymentId,
  deletePayment
);

module.exports = router;
