const express = require("express");

const { register, login, me, refreshAccess, logout, changePassword, deleteAccount } = require("./auth.controller");
const {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  changePasswordValidation
} = require("./auth.validation");

const validate = require("../../middlewares/validate.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

// Register User
router.post(
  "/register",
  registerValidation,
  validate,
  register
);

// login user
router.post(
  "/login",
  loginValidation,
  validate,
  login
);

router.get(
  "/me",
  authMiddleware,
  me
);

router.post(
  "/refresh-token",
  refreshTokenValidation,
  validate,
  refreshAccess
);

router.post(
  "/logout",
  authMiddleware,
  logout
);

router.post(
  "/change-password",
  authMiddleware,
  changePasswordValidation,
  validate,
  changePassword
);

router.delete(
  "/delete-account",
  authMiddleware,
  deleteAccount
);

module.exports = router;