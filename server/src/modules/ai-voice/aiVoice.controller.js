const { validationResult } = require("express-validator");


const ApiError = require("../../shared/errors/ApiError");
const ApiResponse = require("../../shared/utils/ApiResponse");

const HTTP_STATUS = require("../../shared/constants/httpStatus");

const {
  uploadVoiceService,
} = require("./aiVoice.service");

const analyzeVoiceController = async (
  req,
  res,
  next
) => {
  try {
    const errors =
      validationResult(req);

    if (!errors.isEmpty()) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Validation failed.",
        errors.array()
      );
    }

    if (!req.file) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Voice recording is required."
      );
    }

    const result =
      await uploadVoiceService(
        req.file,
        req.user._id,
        req.body.language
      );

    return ApiResponse.success(
      res,
      HTTP_STATUS.OK,
      "Voice analyzed successfully.",
      result
    );

  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeVoiceController,
};