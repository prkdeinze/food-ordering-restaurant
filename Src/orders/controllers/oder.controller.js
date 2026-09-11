const orderService = require("../services/order.service");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to get orders",
    });
  }
};

// Get one order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to get order",
    });
  }
};

// Update order
const updateOrder = async (req, res) => {
  try {
    const order = await orderService.updateOrder(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update order",
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status
    );

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update order status",
    });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const order = await orderService.updatePaymentStatus(
      req.params.id,
      req.body.paymentStatus
    );

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: order,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to update payment status",
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const order = await orderService.cancelOrder(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to cancel order",
    });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    await orderService.deleteOrder(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete order",
    });
  }
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
