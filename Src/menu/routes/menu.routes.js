const express = require("express");

const {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  updateMenuItemAvailability,
  deleteMenuItem,
} = require("../controllers/menu.controller");

const {
  validateMenuItem,
  validateMenuItemId,
  validateAvailabilityUpdate,
} = require("../middleware/menu.middleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Menu Routes
|--------------------------------------------------------------------------
*/

// Create a new menu item
router.post(
  "/",
  validateMenuItem,
  createMenuItem
);

// Get all menu items
router.get(
  "/",
  getAllMenuItems
);

// Get one menu item by ID
router.get(
  "/:id",
  validateMenuItemId,
  getMenuItemById
);

// Update complete menu item
router.put(
  "/:id",
  validateMenuItemId,
  validateMenuItem,
  updateMenuItem
);

// Update only availability
router.patch(
  "/:id/availability",
  validateMenuItemId,
  validateAvailabilityUpdate,
  updateMenuItemAvailability
);

// Delete menu item
router.delete(
  "/:id",
  validateMenuItemId,
  deleteMenuItem
);

module.exports = router;
