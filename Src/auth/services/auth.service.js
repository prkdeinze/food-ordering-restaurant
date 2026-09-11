const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const {
  validateRegisterData,
  validateLoginData,
  sanitizeUser,
} = require("../models/auth.model");

const users = new Map();

const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const hashPassword = (password, salt) => {
  return crypto
    .scryptSync(password, salt, 64)
    .toString("hex");
};

const verifyPassword = (password, salt, storedHash) => {
  const newHash = hashPassword(password, salt);

  const storedBuffer = Buffer.from(storedHash, "hex");
  const newBuffer = Buffer.from(newHash, "hex");

  if (storedBuffer.length !== newBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(storedBuffer, newBuffer);
};

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw createError("JWT_SECRET is not configured", 500);
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const register = async (userData) => {
  const validation = validateRegisterData(userData);

  if (!validation.isValid) {
    throw createError(validation.errors.join(", "), 400);
  }

  const { name, email, password } = validation.data;

  const existingUser = Array.from(users.values()).find(
    (user) => user.email === email
  );

  if (existingUser) {
    throw createError("User with this email already exists", 409);
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(password, salt);

  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    passwordSalt: salt,
    role: "customer",
    createdAt: new Date().toISOString(),
  };

  users.set(user.id, user);

  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
};

const login = async (credentials) => {
  const validation = validateLoginData(credentials);

  if (!validation.isValid) {
    throw createError(validation.errors.join(", "), 400);
  }

  const { email, password } = validation.data;

  const user = Array.from(users.values()).find(
    (item) => item.email === email
  );

  if (!user) {
    throw createError("Invalid email or password", 401);
  }

  const passwordIsValid = verifyPassword(
    password,
    user.passwordSalt,
    user.passwordHash
  );

  if (!passwordIsValid) {
    throw createError("Invalid email or password", 401);
  }

  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
};

const getCurrentUser = async (userId) => {
  const user = users.get(userId);

  if (!user) {
    throw createError("User not found", 404);
  }

  return sanitizeUser(user);
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
