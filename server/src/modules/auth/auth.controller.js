const { registerUser, loginUser,  getCurrentUser,  refreshAccessToken, logoutUser } = require("./auth.service");
const ApiResponse = require("../../shared/utils/ApiResponse");
const HTTP_STATUS = require("../../shared/constants/httpStatus");

const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    return res.status(201).json(
      new ApiResponse(
        201,
        "User registered successfully.",
        user
      )
    );
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Login successful.",
        result
      )
    );
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.user._id);

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Current user fetched successfully.",
        user
      )
    );
  } catch (error) {
    next(error);
  }
};

const refreshAccess = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const result = await refreshAccessToken(refreshToken);

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Access token refreshed successfully.",
        result
      )
    );
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await logoutUser(req.user._id);

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Logout successful.",
        null
      )
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  me,
  refreshAccess,
  logout,
};