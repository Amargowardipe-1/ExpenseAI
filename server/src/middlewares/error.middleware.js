const ApiError = require("../shared/errors/ApiError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      statusCode: err.statusCode,
      message: err.message,
      data: null,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal Server Error",
    data: null,
  });
};

module.exports = errorHandler;