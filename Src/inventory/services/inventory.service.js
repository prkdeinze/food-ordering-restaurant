
const InventoryModel = require("../models/inventory.model");

const inventoryItems = new Map();

const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const createInventoryItem = async (data = {}) => {
  if (!data.name) {
    throw createError("Inventory item name is required", 400);
  }

  const normalizedName = data.name.trim().toLowerCase();

  const existingItem = Array.from(inventoryItems.values()).find(
    (item) => item.name.toLowerCase() === normalizedName
  );

  if (existingItem) {
    throw createError(
      "Inventory item with this name already exists",
      409
    );
  }

  const item = new InventoryModel(data);

  inventoryItems.set(item.id, item);

  return item.toJSON();
};

const getAllInventoryItems = async () => {
  return Array.from(inventoryItems.values()).map((item) =>
    item.toJSON()
  );
};

const getInventoryItemById = async (id) => {
  const item = inventoryItems.get(id);

  if (!item) {
    throw createError("Inventory item not found", 404);
  }

  return item.toJSON();
};

const updateInventoryItem = async (id, data = {}) => {
  const item = inventoryItems.get(id);

  if (!item) {
    throw createError("Inventory item not found", 404);
  }

  if (data.name) {
    const normalizedName = data.name.trim().toLowerCase();

    const duplicateItem = Array.from(
      inventoryItems.values()
    ).find(
      (inventoryItem) =>
        inventoryItem.name.toLowerCase() === normalizedName &&
        inventoryItem.id !== id
    );

    if (duplicateItem) {
      throw createError(
        "Inventory item with this name already exists",
        409
      );
    }
  }

  item.update(data);

  inventoryItems.set(item.id, item);

  return item.toJSON();
};

const updateStock = async (id, quantity) => {
  const item = inventoryItems.get(id);

  if (!item) {
    throw createError("Inventory item not found", 404);
  }

  try {
    item.updateStock(quantity);
  } catch (error) {
    throw createError(error.message, 400);
  }

  inventoryItems.set(item.id, item);

  return item.toJSON();
};

const deleteInventoryItem = async (id) => {
  const item = inventoryItems.get(id);

  if (!item) {
    throw createError("Inventory item not found", 404);
  }

  inventoryItems.delete(id);

  return true;
};

module.exports = {
  createInventoryItem,
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  updateStock,
  deleteInventoryItem,
};
