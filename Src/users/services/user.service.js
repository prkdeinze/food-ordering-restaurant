const crypto = require("crypto");

const db = require("../../../database/database");

const createUser = async (userData) => {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const user = {
    id,
    name: userData.name,
    email: userData.email.toLowerCase().trim(),
    passwordHash: userData.passwordHash,
    passwordSalt: userData.passwordSalt || userData.salt,
    role: userData.role || "customer",
    createdAt,
  };

  db.prepare(`
    INSERT INTO users (
      id,
      name,
      email,
      passwordHash,
      salt,
      role,
      createdAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    user.id,
    user.name,
    user.email,
    user.passwordHash,
    user.passwordSalt,
    user.role,
    user.createdAt
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

const getAllUsers = async () => {
  return db.prepare(`
    SELECT
      id,
      name,
      email,
      role,
      createdAt
    FROM users
    ORDER BY createdAt DESC
  `).all();
};

const getUserById = async (id) => {
  return (
    db.prepare(`
      SELECT
        id,
        name,
        email,
        role,
        createdAt
      FROM users
      WHERE id = ?
    `).get(id) || null
  );
};

const getUserByEmail = async (email) => {
  if (!email) {
    return null;
  }

  const normalizedEmail = email.toLowerCase().trim();

  return (
    db.prepare(`
      SELECT
        id,
        name,
        email,
        role,
        createdAt
      FROM users
      WHERE email = ?
    `).get(normalizedEmail) || null
  );
};

const updateUser = async (id, updateData = {}) => {
  const existingUser = db
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(id);

  if (!existingUser) {
    return null;
  }

  const name =
    updateData.name !== undefined
      ? updateData.name
      : existingUser.name;

  const email =
    updateData.email !== undefined
      ? updateData.email.toLowerCase().trim()
      : existingUser.email;

  const role =
    updateData.role !== undefined
      ? updateData.role
      : existingUser.role;

  db.prepare(`
    UPDATE users
    SET name = ?, email = ?, role = ?
    WHERE id = ?
  `).run(name, email, role, id);

  return getUserById(id);
};

const deleteUser = async (id) => {
  const user = await getUserById(id);

  if (!user) {
    return null;
  }

  db.prepare("DELETE FROM users WHERE id = ?").run(id);

  return user;
};

const changeUserStatus = async (id, status) => {
  const allowedStatuses = ["active", "inactive", "suspended"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid user status");
  }

  // Status column is not yet present in the users table.
  // For now, confirm that the user exists.
  return getUserById(id);
};

const changeUserRole = async (id, role) => {
  const allowedRoles = [
    "customer",
    "restaurant_owner",
    "restaurant_staff",
    "driver",
    "admin",
    "super_admin",
  ];

  if (!allowedRoles.includes(role)) {
    throw new Error("Invalid user role");
  }

  return updateUser(id, { role });
};

const verifyUserEmail = async (id) => {
  // emailVerified column is not yet present in the users table.
  return getUserById(id);
};

const verifyUserPhone = async (id) => {
  // phoneVerified column is not yet present in the users table.
  return getUserById(id);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  changeUserStatus,
  changeUserRole,
  verifyUserEmail,
  verifyUserPhone,
};
