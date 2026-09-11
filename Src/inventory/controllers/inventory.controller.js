
const inventoryService = require("../services/inventory.service");

// Create inventory item
const createInventoryItem = async (req, res) => {
  try {
    const item = await inventoryService.createInventoryItem(req.body);

    return res.status(201).json({
      success: true,
      message: "Inventory item created successfully",
      data: item,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create inventory item",
    });
  }
};

// Get all inventory items
const getAllInventoryItems = async (req, res) => {
  try {
    const items = await inventoryService.getAllInventoryItems();

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to get inventory items",
    });
  }
};

// Get inventory item by ID
const getInventoryItemById = async (req, res) => {
  try {
    const item = await inventoryService.getInventoryItemById(req.params.id);

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to get inventory item",
    });
  }
};

// Update inventory item
const updateInventoryItem = async (req, res) => {
  try {
    const item = await inventoryService.updateInventoryItem(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Inventory item updated successfully",
      data: item,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update inventory item",
    });
  }
};

// Update stock quantity
const updateStock = async (req, res) => {
  try {
    const item = await inventoryService.updateStock(
      req.params.id,
      req.body.quantity
    );

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: item,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update stock",
    });
  }
};

// Delete inventory item
const deleteInventoryItem = async (req, res) => {
  try {
    await inventoryService.deleteInventoryItem(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Inventory item deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete inventory item",
    });
  }
};

module.exports = {
  createInventoryItem,
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  updateStock,
  deleteInventoryItem,
};
