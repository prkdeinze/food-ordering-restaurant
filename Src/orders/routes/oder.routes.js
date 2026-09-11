const express = require("express");

const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  deleteOrder,
} = require("../controllers/order.controller");

const {
  validateOrder,
  validateOrderId,
  validateOrderStatus,
  validatePaymentStatus,
} = require("../middleware/order.middleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Order Routes
|--------------------------------------------------------------------------
*/

// Create order
router.post(
  "/",
  validateOrder,
  createOrder
);

// Get all orders
router.get(
  "/",
  getAllOrders
);

// Get one order by ID
router.get(
  "/:id",
  validateOrderId,
  getOrderById
);

// Update complete order
router.put(
  "/:id",
  validateOrderId,
  validateOrder,
  updateOrder
);

// Update order status
router.patch(
  "/:id/status",
  validateOrderId,
  validateOrderStatus,
  updateOrderStatus
);

// Update payment status
router.patch(
  "/:id/payment-status",
  validateOrderId,
  validatePaymentStatus,
  updatePaymentStatus
);

// Cancel order
router.patch(
  "/:id/cancel",
  validateOrderId,
  cancelOrder
);

// Delete order
router.delete(
  "/:id",
  validateOrderId,
  deleteOrder
);

module.exports = router;
