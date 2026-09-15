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
| Multi-Restaurant Menu Routes
|--------------------------------------------------------------------------
|
| Every menu operation belongs to a specific restaurant.
|
*/

// Create a menu item for a restaurant
router.post(
  "/restaurant/:restaurantId",
  validateMenuItem,
  createMenuItem
);

// Get all menu items for a restaurant
router.get(
  "/restaurant/:restaurantId",
  getAllMenuItems
);

// Get one menu item from a restaurant
router.get(
  "/restaurant/:restaurantId/:id",
  validateMenuItemId,
  getMenuItemById
);

// Update a menu item
router.put(
  "/restaurant/:restaurantId/:id",
  validateMenuItemId,
  validateMenuItem,
  updateMenuItem
);

// Update menu item availability
router.patch(
  "/restaurant/:restaurantId/:id/availability",
  validateMenuItemId,
  validateAvailabilityUpdate,
  updateMenuItemAvailability
);

// Delete a menu item
router.delete(
  "/restaurant/:restaurantId/:id",
  validateMenuItemId,
  deleteMenuItem
);

module.exports = router;
