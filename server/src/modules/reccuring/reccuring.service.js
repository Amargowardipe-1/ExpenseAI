const HTTP_STATUS = require("../../shared/constants/httpStatus");
const ApiError = require("../../shared/utils/ApiError");

const RECURRING_FREQUENCIES = require("../../shared/constants/recurringFrequencies");

const {
  createRecurring,
  findRecurringById,
  getRecurringTransactions,
  updateRecurring,
  deleteRecurring,
} = require("./recurring.repository");


const calculateNextRunDate = (
  currentDate,
  frequency
) => {
  const nextDate = new Date(currentDate);

  switch (frequency) {
    case RECURRING_FREQUENCIES.DAILY:
      nextDate.setDate(nextDate.getDate() + 1);
      break;

    case RECURRING_FREQUENCIES.WEEKLY:
      nextDate.setDate(nextDate.getDate() + 7);
      break;

    case RECURRING_FREQUENCIES.MONTHLY:
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;

    case RECURRING_FREQUENCIES.YEARLY:
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;

    default:
      break;
  }

  return nextDate;
};

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