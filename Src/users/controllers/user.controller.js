const userService = require("../services/user.service");

const createUser = async (req, res) => {
  try {
    const existingUser = await userService.getUserByEmail(req.body.email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists"
      });
    }

    const user = await userService.createUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create user"
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get users"
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get user"
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update user"
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete user"
    });
  }
};

const changeUserStatus = async (req, res) => {
  try {
    const user = await userService.changeUserStatus(
      req.params.id,
      req.body.status
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: user
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to change user status"
    });
  }
};

const changeUserRole = async (req, res) => {
  try {
    const user = await userService.changeUserRole(
      req.params.id,
      req.body.role
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to change user role"
    });
  }
};

const verifyUserEmail = async (req, res) => {
  try {
    const user = await userService.verifyUserEmail(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User email verified successfully",
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to verify user email"
    });
  }
};

const verifyUserPhone = async (req, res) => {
  try {
    const user = await userService.verifyUserPhone(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User phone verified successfully",
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to verify user phone"
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserStatus,
  changeUserRole,
  verifyUserEmail,
  verifyUserPhone
};
