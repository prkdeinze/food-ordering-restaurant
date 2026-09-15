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
  validateRestaurantId,
  validateMenuItem,
  validateMenuItemId,
  validateAvailabilityUpdate,
} = require("../middleware/menu.middleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Multi-Restaurant Menu Routes
|--------------------------------------------------------------------------
*/

// Create a menu item for a restaurant
router.post(
  "/restaurant/:restaurantId",
  validateRestaurantId,
  validateMenuItem,
  createMenuItem
);

// Get all menu items for a restaurant
router.get(
  "/restaurant/:restaurantId",
  validateRestaurantId,
  getAllMenuItems
);

// Get one menu item by ID
router.get(
  "/restaurant/:restaurantId/:id",
  validateRestaurantId,
  validateMenuItemId,
  getMenuItemById
);

// Update a menu item
router.put(
  "/restaurant/:restaurantId/:id",
  validateRestaurantId,
  validateMenuItemId,
  validateMenuItem,
  updateMenuItem
);

// Update menu item availability
router.patch(
  "/restaurant/:restaurantId/:id/availability",
  validateRestaurantId,
  validateMenuItemId,
  validateAvailabilityUpdate,
  updateMenuItemAvailability
);

// Delete a menu item
router.delete(
  "/restaurant/:restaurantId/:id",
  validateRestaurantId,
  validateMenuItemId,
  deleteMenuItem
);

module.exports = router;
