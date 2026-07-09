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

  return await updateExpense(
    expenseId,
    updateData
  );
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