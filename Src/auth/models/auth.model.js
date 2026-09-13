const validateRegisterData = (userData = {}) => {
  const errors = [];

  const name =
    typeof userData.name === "string"
      ? userData.name.trim()
      : "";

  const email =
    typeof userData.email === "string"
      ? userData.email.trim().toLowerCase()
      : "";

  const password =
    typeof userData.password === "string"
      ? userData.password
      : "";

  if (!name) {
    errors.push("Name is required");
  }

  if (!email) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Email is invalid");
  }

  if (!password) {
    errors.push("Password is required");
  } else if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      name,
      email,
      password,
    },
  };
};

const validateLoginData = (credentials = {}) => {
  const errors = [];

  const email =
    typeof credentials.email === "string"
      ? credentials.email.trim().toLowerCase()
      : "";

  const password =
    typeof credentials.password === "string"
      ? credentials.password
      : "";

  if (!email) {
    errors.push("Email is required");
  }

  if (!password) {
    errors.push("Password is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      email,
      password,
    },
  };
};

const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const {
    passwordHash,
    passwordSalt,
    ...safeUser
  } = user;

  return safeUser;
};

module.exports = {
  validateRegisterData,
  validateLoginData,
  sanitizeUser,
};
