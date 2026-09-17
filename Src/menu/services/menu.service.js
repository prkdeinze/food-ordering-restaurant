const { randomUUID } = require("crypto");
const db = require("../../../database/database");

// Convert SQLite row into API-friendly object
const formatMenuItem = (row) => {
  if (!row) return null;

  return {
    ...row,
    isAvailable: Boolean(row.isAvailable),
  };
};

// Create menu item
const createMenuItem = async (restaurantId, data) => {
  const now = new Date().toISOString();

  const item = {
    id: randomUUID(),
    restaurantId,
    name: data.name,
    description: data.description || "",
    price: data.price,
    category: data.category || "",
    image: data.image || "",
    isAvailable:
      data.isAvailable === undefined ? true : data.isAvailable,
    createdAt: now,
    updatedAt: now,
  };

  db.prepare(`
    INSERT INTO menu_items (
      id,
      restaurantId,
      name,
      description,
      price,
      category,
      image,
      isAvailable,
      createdAt,
      updatedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    item.id,
    item.restaurantId,
    item.name,
    item.description,
    item.price,
    item.category,
    item.image,
    item.isAvailable ? 1 : 0,
    item.createdAt,
    item.updatedAt
  );

  return item;
};

// Get all menu items for one restaurant
const getAllMenuItems = async (restaurantId) => {
  const rows = db
    .prepare(`
      SELECT *
      FROM menu_items
      WHERE restaurantId = ?
      ORDER BY createdAt DESC
    `)
    .all(restaurantId);

  return rows.map(formatMenuItem);
};

// Get one menu item
const getMenuItemById = async (restaurantId, id) => {
  const row = db
    .prepare(`
      SELECT *
      FROM menu_items
      WHERE restaurantId = ? AND id = ?
    `)
    .get(restaurantId, id);

  return row ? formatMenuItem(row) : null;
};

// Update menu item
const updateMenuItem = async (restaurantId, id, data) => {
  const existing = await getMenuItemById(restaurantId, id);

  if (!existing) {
    return null;
  }

  const updatedItem = {
    ...existing,
    name: data.name,
    description:
      data.description !== undefined
        ? data.description
        : existing.description,
    price: data.price,
    category:
      data.category !== undefined
        ? data.category
        : existing.category,
    image:
      data.image !== undefined
        ? data.image
        : existing.image,
    isAvailable:
      data.isAvailable !== undefined
        ? data.isAvailable
        : existing.isAvailable,
    updatedAt: new Date().toISOString(),
  };

  db.prepare(`
    UPDATE menu_items
    SET
      name = ?,
      description = ?,
      price = ?,
      category = ?,
      image = ?,
      isAvailable = ?,
      updatedAt = ?
    WHERE restaurantId = ? AND id = ?
  `).run(
    updatedItem.name,
    updatedItem.description,
    updatedItem.price,
    updatedItem.category,
    updatedItem.image,
    updatedItem.isAvailable ? 1 : 0,
    updatedItem.updatedAt,
    restaurantId,
    id
  );

  return updatedItem;
};

// Update availability only
const updateMenuItemAvailability = async (
  restaurantId,
  id,
  isAvailable
) => {
  const existing = await getMenuItemById(restaurantId, id);

  if (!existing) {
    return null;
  }

  const updatedAt = new Date().toISOString();

  db.prepare(`
    UPDATE menu_items
    SET isAvailable = ?, updatedAt = ?
    WHERE restaurantId = ? AND id = ?
  `).run(
    isAvailable ? 1 : 0,
    updatedAt,
    restaurantId,
    id
  );

  return getMenuItemById(restaurantId, id);
};

// Delete menu item
const deleteMenuItem = async (restaurantId, id) => {
  const existing = await getMenuItemById(restaurantId, id);

  if (!existing) {
    return null;
  }

  db.prepare(`
    DELETE FROM menu_items
    WHERE restaurantId = ? AND id = ?
  `).run(restaurantId, id);

  return existing;
};

module.exports = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  updateMenuItemAvailability,
  deleteMenuItem,
};
