
const express = require("express");

const {
  createInventoryItem,
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  updateStock,
  deleteInventoryItem,
} = require("../controllers/inventory.controller");

const {
  validateInventoryItem,
  validateInventoryId,
  validateStockUpdate,
} = require("../middleware/inventory.middleware");

const router = express.Router();

// Create inventory item
router.post(
  "/",
  validateInventoryItem,
  createInventoryItem
);

// Get all inventory items
router.get(
  "/",
  getAllInventoryItems
);

// Get one inventory item
router.get(
  "/:id",
  validateInventoryId,
  getInventoryItemById
);

// Update inventory item
router.put(
  "/:id",
  validateInventoryId,
  validateInventoryItem,
  updateInventoryItem
);

// Update stock quantity
router.patch(
  "/:id/stock",
  validateInventoryId,
  validateStockUpdate,
  updateStock
);

// Delete inventory item
router.delete(
  "/:id",
  validateInventoryId,
  deleteInventoryItem
);

module.exports = router;
