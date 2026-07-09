const User = require("../user/user.model");

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (userData) => {
  return await User.create(userData);
};

const findUserById = async (userId) => {
  return await User.findById(userId);
};

const updateRefreshToken = async (userId, refreshToken) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      refreshToken,
    },
    {
      new: true,
    }
  );
};

const findUserByEmailWithPassword = async (email) => {
  return await User.findOne({ email }).select("+password +refreshToken");
};

const findUserByIdWithRefreshToken = async (userId) => {
  return await User.findById(userId).select("+refreshToken");
};

const removeRefreshToken = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    }
  );
};

const findUserByIdWithPassword = async (userId) => {
  return await User.findById(userId).select("+password");
};

// update password
const updatePassword = async (
  userId,
  hashedPassword
) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      password: hashedPassword,
      refreshToken: null,
    },
    {
      new: true,
    }
  );
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
  findUserByEmailWithPassword,
  updateRefreshToken,
  findUserByIdWithRefreshToken,
  removeRefreshToken,
  findUserByIdWithPassword,
  updatePassword,
};