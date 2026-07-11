const HTTP_STATUS = require("../../shared/constants/httpStatus");
const ApiError = require("../../shared/errors/ApiError");
const BUDGET_STATUS = require("../../shared/constants/budget.Status");
const {
  getTotalExpenseByDateRange,
} = require("../expense/expense.repository");

const {
  getMonthRange,
} = require("../../shared/utils/dateRange");

const {
  createBudget,
  findBudgetById,
  findBudgetByUserAndMonth,
  updateBudget,
  deleteBudget,
} = require("./budget.repository");

const {
  createNotificationService,
  createBudgetNotificationService,
} = require("../notification/notification.service");

const NOTIFICATION_TYPES = require(
  "../../shared/constants/notificationTypes"
);


const createBudgetService = async (
  userId,
  budgetData
) => {
  const { month, year } = budgetData;

  const existingBudget =
    await findBudgetByUserAndMonth(
      userId,
      month,
      year
    );

  if (existingBudget) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      "Budget already exists for this month."
    );
  }

  return await createBudget({
    user: userId,
    ...budgetData,
  });
};

const getCurrentBudgetService = async (
  userId,
  month,
  year
) => {
  const budget =
    await findBudgetByUserAndMonth(
      userId,
      month,
      year
    );

  if (!budget) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Budget not found."
    );
  }

  return budget;
};

const updateBudgetService = async (
  budgetId,
  updateData
) => {

    const existingBudget =
  await findBudgetByUserAndMonth(
    userId,
    month,
    year
  );

if (
  existingBudget &&
  existingBudget._id.toString() !== budgetId
) {
  throw new ApiError(
    HTTP_STATUS.CONFLICT,
    "Budget already exists for this month."
  );
}

  const budget = await findBudgetById(
    budgetId
  );

  if (!budget) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Budget not found."
    );
  }

  return await updateBudget(
    budgetId,
    updateData
  );
};

const deleteBudgetService = async (
  budgetId
) => {
  const budget = await findBudgetById(
    budgetId
  );

  if (!budget) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Budget not found."
    );
  }

  await deleteBudget(budgetId);
};

const getBudgetProgressService = async (
  userId,
  month,
  year
) => {
  const budget =
    await findBudgetByUserAndMonth(
      userId,
      month,
      year
    );

  if (!budget) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Budget not found."
    );
  }

  const { startDate, endDate } =
    getMonthRange(month, year);

  const spent =
    await getTotalExpenseByDateRange(
      userId,
      startDate,
      endDate
    );

  const remaining =
    budget.amount - spent;

  const usedPercentage =
    budget.amount === 0
      ? 0
      : Number(
          (
            (spent / budget.amount) *
            100
          ).toFixed(2)
        );

        
  let status = BUDGET_STATUS.ON_TRACK;

if (usedPercentage >= 100) {

  status = BUDGET_STATUS.EXCEEDED;

  await createBudgetNotificationService(
    userId,
    NOTIFICATION_TYPES.BUDGET_EXCEEDED,
    "Budget Exceeded",
    "You have exceeded your monthly budget.",
    month,
    year
  );

} else if (usedPercentage >= 80) {

  status = BUDGET_STATUS.WARNING;

  await createBudgetNotificationService(
    userId,
    NOTIFICATION_TYPES.BUDGET_WARNING,
    "Budget Warning",
    `You have used ${usedPercentage}% of your monthly budget.`,
    month,
    year
  );
}

return {
  budget: budget.amount,
  spent,
  remaining,
  usedPercentage,
  status,
};
}

module.exports = {
  createBudgetService,
  getCurrentBudgetService,
  updateBudgetService,
  deleteBudgetService,
   getBudgetProgressService,
}