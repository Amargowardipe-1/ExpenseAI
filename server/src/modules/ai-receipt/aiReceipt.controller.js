const HTTP_STATUS = require("../../shared/constants/httpStatus");

const ApiError = require("../../shared/errors/ApiError");
const ApiResponse = require("../../shared/utils/ApiResponse");

const {
  uploadReceiptService,
} = require("./aiReceipt.service");

const uploadReceipt = async (
  req,
  res,
  next
) => {
  try {

    if (!req.file) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Receipt image is required."
      );
    }

    const { source } = req.body;

    const result =
      await uploadReceiptService(
        req.file,
        req.user._id,
        source
      );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Receipt uploaded successfully.",
        result
      )
    );

  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadReceipt,
};