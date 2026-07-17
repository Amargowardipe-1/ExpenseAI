const bcrypt = require("bcryptjs");

const ApiError = require("../../shared/errors/ApiError");
const HTTP_STATUS = require("../../shared/constants/httpStatus");
const generateAccessToken = require("../../shared/utils/generateAccessToken");
const generateRefreshToken = require("../../shared/utils/generateRefreshToken");
const jwt = require("jsonwebtoken");


const {
  findUserByEmail,
  createUser,
  findUserById,
    findUserByEmailWithPassword,
     updateRefreshToken,
  findUserByIdWithRefreshToken,
  removeRefreshToken,
  findUserByIdWithPassword,
  updatePassword,
} = require("./auth.repository");

const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Check existing user
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
   throw new ApiError(
  HTTP_STATUS.CONFLICT,
  "Email already exists."
);
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create User
  const user = await createUser({
    name,
    email,
    password: hashedPassword,
  });

  const createdUser = await findUserById(user._id);

  return createdUser
};

//login user

const loginUser = async ({ email, password }) => {

  const user = await findUserByEmailWithPassword(email);

  if (!user) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Invalid email or password."
    );
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Invalid email or password."
    );
  }

  const accessToken = generateAccessToken({
    id: user._id,
  });

  const refreshToken = generateRefreshToken({
    id: user._id,
  });

  await updateRefreshToken(
    user._id,
    refreshToken
  );

  const loggedInUser = await findUserById(user._id);

  return {
    user: loggedInUser,
    accessToken,
    refreshToken,
  };
};

//get current user
const getCurrentUser = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "User not found."
    );
  }

  return user;
};

//refresh access token
const refreshAccessToken = async (refreshToken) => {

  let decoded;

  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
  } catch {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Invalid or expired refresh token."
    );
  }

  const user = await findUserById(decoded.id);

  if (!user) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "User not found."
    );
  }

  // Verify token stored in DB
  const userWithToken = await findUserByEmailWithPassword(user.email);

  if (userWithToken.refreshToken !== refreshToken) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Refresh token mismatch."
    );
  }

  const accessToken = generateAccessToken({
    id: user._id,
  });

  return {
    accessToken,
  };
};

// logout user
const logoutUser = async (userId) => {
  await removeRefreshToken(userId);

  return null;
};

// change user password
const changePasswordUser = async (userId, { currentPassword, newPassword }) => {
  const user = await findUserByIdWithPassword(userId);

  if (!user) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "User not found."
    );
  }

  const isPasswordMatched = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isPasswordMatched) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Invalid current password."
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await updatePassword(userId, hashedPassword);

  return null;
};

// delete user account and all user data
const deleteUserAccount = async (userId) => {
  const User = require("../user/user.model");
  const Expense = require("../expense/expense.model");
  const Budget = require("../budget/budget.model");
  const Category = require("../category/category.model");
  const Notification = require("../notification/notification.model");

  await User.findByIdAndDelete(userId);
  await Expense.deleteMany({ user: userId });
  await Budget.deleteMany({ user: userId });
  await Category.deleteMany({ user: userId });
  await Notification.deleteMany({ user: userId });

  return null;
};

module.exports = {
  registerUser,
  loginUser, 
  getCurrentUser,
  refreshAccessToken,
  logoutUser,
  changePasswordUser,
  deleteUserAccount,
};