const HTTP_STATUS = require("../../shared/constants/httpStatus");
const ApiError = require("../../shared/errors/ApiError");

const RECURRING_FREQUENCIES = require("../../shared/constants/recurringFrequencies");
const {
  calculateNextRunDate,
} = require("../../shared/utils/reccuringDate");


const {
  createRecurring,
  findRecurringById,
  getRecurringTransactions,
  updateRecurring,
  deleteRecurring,
} = require("./reccuring.repository");




const createRecurringService = async (
  userId,
  recurringData
) => {
  return await createRecurring({
    user: userId,
    ...recurringData,
    nextRunDate: recurringData.startDate,
  });
};

const getRecurringTransactionsService = async (
  userId,
  pageNumber,
  limit
) => {
  const page = Number(pageNumber) || 1;
  const limitValue = Number(limit) || 20;

  const skip = (page - 1) * limitValue;

  return await getRecurringTransactions(
    userId,
    skip,
    limitValue
  );
};

const getRecurringByIdService = async (
  recurringId
) => {
  const recurring =
    await findRecurringById(recurringId);

  if (!recurring) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Recurring transaction not found."
    );
  }

  return recurring;
};

const updateRecurringService = async (
  recurringId,
  updateData
) => {
  const recurring =
    await findRecurringById(recurringId);

  if (!recurring) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Recurring transaction not found."
    );
  }

  if (
    updateData.startDate ||
    updateData.frequency
  ) {
    updateData.nextRunDate =
      calculateNextRunDate(
        updateData.startDate || recurring.startDate,
        updateData.frequency || recurring.frequency
      );
  }

  return await updateRecurring(
    recurringId,
    updateData
  );
};

const deleteRecurringService = async (
  recurringId
) => {
  const recurring =
    await findRecurringById(recurringId);

  if (!recurring) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Recurring transaction not found."
    );
  }

  await deleteRecurring(recurringId);
};

module.exports = {
  createRecurringService,
  getRecurringTransactionsService,
  getRecurringByIdService,
  updateRecurringService,
  deleteRecurringService,
};