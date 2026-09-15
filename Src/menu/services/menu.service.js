const MenuModel = require("../models/menu.model");

const menuItems = new Map();

const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const createMenuItem = async (data = {}) => {
  if (!data.restaurantId) {
    throw createError("Restaurant ID is required", 400);
  }

  if (!data.name) {
    throw createError("Menu item name is required", 400);
  }

  const restaurantId = data.restaurantId.trim();
  const normalizedName = data.name.trim().toLowerCase();

  const existingItem = Array.from(menuItems.values()).find(
    (item) =>
      item.restaurantId === restaurantId &&
      item.name.toLowerCase() === normalizedName
  );

  if (existingItem) {
    throw createError(
      "Menu item with this name already exists for this restaurant",
      409
    );
  }

  const menuItem = new MenuModel({
    ...data,
    restaurantId,
  });

  menuItems.set(menuItem.id, menuItem);

  return menuItem.toJSON();
};

const getAllMenuItems = async (restaurantId) => {
  if (!restaurantId) {
    throw createError("Restaurant ID is required", 400);
  }

  return Array.from(menuItems.values())
    .filter((item) => item.restaurantId === restaurantId)
    .map((item) => item.toJSON());
};

const getMenuItemById = async (id, restaurantId) => {
  if (!restaurantId) {
    throw createError("Restaurant ID is required", 400);
  }

  const menuItem = menuItems.get(id);

  if (
    !menuItem ||
    menuItem.restaurantId !== restaurantId
  ) {
    throw createError("Menu item not found", 404);
  }

  return menuItem.toJSON();
};

const updateMenuItem = async (
  id,
  restaurantId,
  data = {}
) => {
  if (!restaurantId) {
    throw createError("Restaurant ID is required", 400);
  }

  const menuItem = menuItems.get(id);

  if (
    !menuItem ||
    menuItem.restaurantId !== restaurantId
  ) {
    throw createError("Menu item not found", 404);
  }

  if (data.name) {
    const normalizedName = data.name
      .trim()
      .toLowerCase();

    const duplicateItem = Array.from(
      menuItems.values()
    ).find(
      (item) =>
        item.restaurantId === restaurantId &&
        item.name.toLowerCase() === normalizedName &&
        item.id !== id
    );

    if (duplicateItem) {
      throw createError(
        "Menu item with this name already exists for this restaurant",
        409
      );
    }
  }

  const safeData = {
    ...data,
  };

  delete safeData.restaurantId;

  menuItem.update(safeData);

  menuItems.set(menuItem.id, menuItem);

  return menuItem.toJSON();
};

const updateMenuItemAvailability = async (
  id,
  restaurantId,
  isAvailable
) => {
  if (!restaurantId) {
    throw createError("Restaurant ID is required", 400);
  }

  const menuItem = menuItems.get(id);

  if (
    !menuItem ||
    menuItem.restaurantId !== restaurantId
  ) {
    throw createError("Menu item not found", 404);
  }

  try {
    menuItem.updateAvailability(isAvailable);
  } catch (error) {
    throw createError(error.message, 400);
  }

  menuItems.set(menuItem.id, menuItem);

  return menuItem.toJSON();
};

const deleteMenuItem = async (
  id,
  restaurantId
) => {
  if (!restaurantId) {
    throw createError("Restaurant ID is required", 400);
  }

  const menuItem = menuItems.get(id);

  if (
    !menuItem ||
    menuItem.restaurantId !== restaurantId
  ) {
    throw createError("Menu item not found", 404);
  }

  menuItems.delete(id);

  return true;
};

module.exports = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  updateMenuItemAvailability,
  deleteMenuItem,
};
