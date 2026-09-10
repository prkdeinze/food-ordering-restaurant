const express = require("express");

const router = express.Router();

const userController = require("../controllers/user.controller");

const {
  validateUser,
  validateEmail,
  validateRole,
  validateUserId
} = require("../middleware/user.middleware");

router.post(
  "/",
  validateUser,
  validateEmail,
  userController.createUser
);

router.get(
  "/",
  userController.getAllUsers
);

router.get(
  "/:id",
  validateUserId,
  userController.getUserById
);

router.put(
  "/:id",
  validateUserId,
  validateEmail,
  userController.updateUser
);

router.delete(
  "/:id",
  validateUserId,
  userController.deleteUser
);

router.patch(
  "/:id/status",
  validateUserId,
  userController.changeUserStatus
);

router.patch(
  "/:id/role",
  validateUserId,
  userController.changeUserRole
);

router.patch(
  "/:id/verify-email",
  validateUserId,
  userController.verifyUserEmail
);

router.patch(
  "/:id/verify-phone",
  validateUserId,
  userController.verifyUserPhone
);

module.exports = router;
