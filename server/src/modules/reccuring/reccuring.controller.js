const HTTP_STATUS = require("../../shared/constants/httpStatus");
const ApiResponse = require("../../shared/utils/ApiResponse");

const {
  createRecurringService,
  getRecurringTransactionsService,
  getRecurringByIdService,
  updateRecurringService,
  deleteRecurringService,
} = require("./recurring.service");

const createRecurring = async (
  req,
  res,
  next
) => {
  try {
    const recurring =
      await createRecurringService(
        req.user._id,
        req.body
      );

    return res.status(HTTP_STATUS.CREATED).json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        "Recurring transaction created successfully.",
        recurring
      )
    );
  } catch (error) {
    next(error);
  }
};

const getRecurringTransactions = async (
  req,
  res,
  next
) => {
  try {
    const { page, limit } = req.query;

    const recurringTransactions =
      await getRecurringTransactionsService(
        req.user._id,
        page,
        limit
      );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Recurring transactions fetched successfully.",
        recurringTransactions
      )
    );
  } catch (error) {
    next(error);
  }
};

const getRecurringById = async (
  req,
  res,
  next
) => {
  try {
    const recurring =
      await getRecurringByIdService(
        req.params.id
      );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Recurring transaction fetched successfully.",
        recurring
      )
    );
  } catch (error) {
    next(error);
  }
};

const updateRecurring = async (
  req,
  res,
  next
) => {
  try {
    const recurring =
      await updateRecurringService(
        req.params.id,
        req.body
      );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Recurring transaction updated successfully.",
        recurring
      )
    );
  } catch (error) {
    next(error);
  }
};

const deleteRecurring = async (
  req,
  res,
  next
) => {
  try {
    await deleteRecurringService(
      req.params.id
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Recurring transaction deleted successfully."
      )
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecurring,
  getRecurringTransactions,
  getRecurringById,
  updateRecurring,
  deleteRecurring,
};