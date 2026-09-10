const crypto = require("crypto");

const users = new Map();

const createUser = async (userData) => {
  const id = crypto.randomUUID();

  const user = {
    id,
    name: userData.name,
    email: userData.email.toLowerCase().trim(),
    phone: userData.phone || null,
    passwordHash: userData.passwordHash,
    role: userData.role || "customer",
    status: "active",
    emailVerified: false,
    phoneVerified: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  users.set(id, user);

  return user;
};

const getAllUsers = async () => {
  return Array.from(users.values());
};

const getUserById = async (id) => {
  return users.get(id) || null;
};

const getUserByEmail = async (email) => {
  if (!email) {
    return null;
  }

  const normalizedEmail = email.toLowerCase().trim();

  return (
    Array.from(users.values()).find(
      (user) => user.email === normalizedEmail
    ) || null
  );
};

const updateUser = async (id, updateData) => {
  const user = users.get(id);

  if (!user) {
    return null;
  }

  const updatedUser = {
    ...user,
    ...updateData,
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: new Date()
  };

  if (updatedUser.email) {
    updatedUser.email = updatedUser.email.toLowerCase().trim();
  }

  users.set(id, updatedUser);

  return updatedUser;
};

const deleteUser = async (id) => {
  const user = users.get(id);

  if (!user) {
    return null;
  }

  users.delete(id);

  return user;
};

const changeUserStatus = async (id, status) => {
  const allowedStatuses = ["active", "inactive", "suspended"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid user status");
  }

  return updateUser(id, { status });
};

const changeUserRole = async (id, role) => {
  const allowedRoles = [
    "customer",
    "restaurant_owner",
    "restaurant_staff",
    "driver",
    "admin",
    "super_admin"
  ];

  if (!allowedRoles.includes(role)) {
    throw new Error("Invalid user role");
  }

  return updateUser(id, { role });
};

const verifyUserEmail = async (id) => {
  return updateUser(id, {
    emailVerified: true
  });
};

const verifyUserPhone = async (id) => {
  return updateUser(id, {
    phoneVerified: true
  });
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
  verifyUserPhone
};
