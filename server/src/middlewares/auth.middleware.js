const jwt = require("jsonwebtoken");

const ApiError = require("../shared/errors/ApiError");
const HTTP_STATUS = require("../shared/constants/httpStatus");

const { findUserById } = require("../modules/auth/auth.repository");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Access token is required."
      );
    }

    // Remove "Bearer "
    let token = authHeader.split(" ")[1];

    // Remove accidental quotes
    token = token.replace(/^"|"$/g, "");

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    const user = await findUserById(decoded.id);

    if (!user) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "User not found."
      );
    }

    req.user = user;

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(
        new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          "Invalid or expired access token."
        )
      );
    }

    next(error);
  }
};

module.exports = authMiddleware;