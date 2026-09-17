const menuService = require("../services/menu.service");

// Get restaurant ID from request
const getRestaurantId = (req) => {
  return (
    req.params.restaurantId ||
    req.body.restaurantId ||
    req.query.restaurantId
  );
};

// Create menu item
const createMenuItem = async (req, res) => {
  try {
    const restaurantId = getRestaurantId(req);

    const menuItem = await menuService.createMenuItem(restaurantId, req.body);

    return res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: menuItem,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create menu item",
    });
  }
};

// Get all menu items for one restaurant
const getAllMenuItems = async (req, res) => {
  try {
    const restaurantId = getRestaurantId(req);

    const menuItems =
      await menuService.getAllMenuItems(restaurantId);

    return res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to get menu items",
    });
  }
};

// Get one menu item
const getMenuItemById = async (req, res) => {
  try {
    const restaurantId = getRestaurantId(req);

    const menuItem = await menuService.getMenuItemById(
      restaurantId,
      req.params.id
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to get menu item",
    });
  }
};

// Update menu item
const updateMenuItem = async (req, res) => {
  try {
    const restaurantId = getRestaurantId(req);

    const menuItem = await menuService.updateMenuItem(
      restaurantId,
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: menuItem,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update menu item",
    });
  }
};

// Update menu item availability
const updateMenuItemAvailability = async (req, res) => {
  try {
    const restaurantId = getRestaurantId(req);

    const menuItem =
      await menuService.updateMenuItemAvailability(
        restaurantId,
        req.params.id,
        req.body.isAvailable
      );

    return res.status(200).json({
      success: true,
      message:
        "Menu item availability updated successfully",
      data: menuItem,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to update menu item availability",
    });
  }
};

// Delete menu item
const deleteMenuItem = async (req, res) => {
  try {
    const restaurantId = getRestaurantId(req);

    await menuService.deleteMenuItem(
      req.params.id,
      restaurantId
    );

    return res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete menu item",
    });
  }
};

module.exports = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  updateMenuItemAvailability,
  deleteMenuItem,
};
