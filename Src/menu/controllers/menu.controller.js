const menuService = require("../services/menu.service");

// Create menu item
const createMenuItem = async (req, res) => {
  try {
    const menuItem = await menuService.createMenuItem(req.body);

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

// Get all menu items
const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await menuService.getAllMenuItems();

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

// Get menu item by ID
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await menuService.getMenuItemById(
      req.params.id
    );

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
    const menuItem = await menuService.updateMenuItem(
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
    const menuItem =
      await menuService.updateMenuItemAvailability(
        req.params.id,
        req.body.isAvailable
      );

    return res.status(200).json({
      success: true,
      message: "Menu item availability updated successfully",
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
    await menuService.deleteMenuItem(req.params.id);

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
