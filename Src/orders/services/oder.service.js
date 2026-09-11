const OrderModel = require("../models/order.model");

const orders = new Map();

const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Create a new order
const createOrder = async (data = {}) => {
  if (!Array.isArray(data.items) || data.items.length === 0) {
    throw createError(
      "Order must contain at least one item",
      400
    );
  }

  if (!data.customerName) {
    throw createError(
      "Customer name is required",
      400
    );
  }

  if (!data.customerPhone) {
    throw createError(
      "Customer phone is required",
      400
    );
  }

  if (!data.orderType) {
    throw createError(
      "Order type is required",
      400
    );
  }

  if (
    data.orderType === "delivery" &&
    !data.deliveryAddress
  ) {
    throw createError(
      "Delivery address is required",
      400
    );
  }

  const order = new OrderModel(data);

  orders.set(order.id, order);

  return order.toJSON();
};

// Get all orders
const getAllOrders = async () => {
  return Array.from(orders.values())
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .map((order) => order.toJSON());
};

// Get one order by ID
const getOrderById = async (id) => {
  const order = orders.get(id);

  if (!order) {
    throw createError(
      "Order not found",
      404
    );
  }

  return order.toJSON();
};

// Update complete order
const updateOrder = async (id, data = {}) => {
  const order = orders.get(id);

  if (!order) {
    throw createError(
      "Order not found",
      404
    );
  }

  if (
    order.status === "completed" ||
    order.status === "cancelled"
  ) {
    throw createError(
      "Completed or cancelled order cannot be edited",
      400
    );
  }

  try {
    order.update(data);
  } catch (error) {
    throw createError(
      error.message || "Failed to update order",
      400
    );
  }

  orders.set(order.id, order);

  return order.toJSON();
};

// Update order status
const updateOrderStatus = async (
  id,
  status
) => {
  const order = orders.get(id);

  if (!order) {
    throw createError(
      "Order not found",
      404
    );
  }

  if (order.status === "cancelled") {
    throw createError(
      "Cancelled order status cannot be changed",
      400
    );
  }

  if (order.status === "completed") {
    throw createError(
      "Completed order status cannot be changed",
      400
    );
  }

  try {
    order.updateStatus(status);
  } catch (error) {
    throw createError(
      error.message || "Invalid order status",
      400
    );
  }

  orders.set(order.id, order);

  return order.toJSON();
};

// Update payment status
const updatePaymentStatus = async (
  id,
  paymentStatus
) => {
  const order = orders.get(id);

  if (!order) {
    throw createError(
      "Order not found",
      404
    );
  }

  try {
    order.updatePaymentStatus(paymentStatus);
  } catch (error) {
    throw createError(
      error.message || "Invalid payment status",
      400
    );
  }

  orders.set(order.id, order);

  return order.toJSON();
};

// Cancel order
const cancelOrder = async (id) => {
  const order = orders.get(id);

  if (!order) {
    throw createError(
      "Order not found",
      404
    );
  }

  try {
    order.cancel();
  } catch (error) {
    throw createError(
      error.message || "Order cannot be cancelled",
      400
    );
  }

  orders.set(order.id, order);

  return order.toJSON();
};

// Delete order
const deleteOrder = async (id) => {
  const order = orders.get(id);

  if (!order) {
    throw createError(
      "Order not found",
      404
    );
  }

  orders.delete(id);

  return true;
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  deleteOrder,
};
