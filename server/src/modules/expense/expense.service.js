const ApiError = require("../../shared/errors/ApiError");
const HTTP_STATUS = require("../../shared/constants/httpStatus");

const {
  createExpense,
  getExpenses,
  findExpenseById,
  updateExpense,
} = require("./expense.repository");

const {
  findCategoryById,
} = require("../category/category.repository");

const createExpenseService = async (userId, expenseData) => {
  const category = await findCategoryById(
    userId,
    expenseData.category
  );

  if (!category) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Category not found."
    );
  }

  if (category.type !== expenseData.transactionType) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Category type does not match transaction type."
    );
  }

  const expense = await createExpense({
    ...expenseData,
    user: userId,
  });

  if (expense.transactionType === "Expense" && expense.amount >= 10000) {
    try {
      const { createNotificationService } = require("../notification/notification.service");
      const NOTIFICATION_TYPES = require("../../shared/constants/notificationTypes");
      await createNotificationService({
        user: userId,
        type: NOTIFICATION_TYPES.LARGE_EXPENSE,
        title: "Large Expense Alert",
        message: `You recorded a large expense of ₹${expense.amount} for "${expense.title}".`,
        metadata: {
          expenseId: expense._id,
          amount: expense.amount,
        },
      });
    } catch (err) {
      console.log("Failed to create large expense notification:", err);
    }
  }

  return expense;
};


const getExpensesService = async (userId) => {
  return await getExpenses(userId);
};

const getExpenseByIdService = async (
  userId,
  expenseId
) => {
  const expense = await findExpenseById(
    userId,
    expenseId
  );

  if (!expense) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Expense not found."
    );
  }

  return expense;
};

const updateExpenseService = async (
  userId,
  expenseId,
  updateData
) => {
  const expense = await findExpenseById(
    userId,
    expenseId
  );

  if (!expense) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Expense not found."
    );
  }

  // Category change ho rahi hai
  if (updateData.category) {
    const category = await findCategoryById(
      userId,
      updateData.category
    );

    if (!category) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Category not found."
      );
    }

    const transactionType =
      updateData.transactionType ||
      expense.transactionType;

    if (category.type !== transactionType) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Category type does not match transaction type."
      );
    }
  }

  delete updateData.user;
  delete updateData.isDeleted;

  const updatedExpense = await updateExpense(
    expenseId,
    updateData
  );

  if (updatedExpense.transactionType === "Expense" && updatedExpense.amount >= 10000) {
    try {
      const { createNotificationService } = require("../notification/notification.service");
      const NOTIFICATION_TYPES = require("../../shared/constants/notificationTypes");
      await createNotificationService({
        user: userId,
        type: NOTIFICATION_TYPES.LARGE_EXPENSE,
        title: "Large Expense Alert",
        message: `You updated a large expense: ₹${updatedExpense.amount} for "${updatedExpense.title}".`,
        metadata: {
          expenseId: updatedExpense._id,
          amount: updatedExpense.amount,
        },
      });
    } catch (err) {
      console.log("Failed to create large expense notification:", err);
    }
  }

  return updatedExpense;
};

const deleteExpenseService = async (
  userId,
  expenseId
) => {
  const expense = await findExpenseById(
    userId,
    expenseId
  );

  if (!expense) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Expense not found."
    );
  }

  await deleteExpense(expenseId);

  return null;
};

module.exports = {
  createExpenseService,
  getExpensesService,
  getExpenseByIdService,
  updateExpenseService,
  deleteExpenseService,
};