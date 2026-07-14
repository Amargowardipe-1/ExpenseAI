const HTTP_STATUS = require("../../shared/constants/httpStatus");
const ApiResponse = require("../../shared/utils/ApiResponse");
const { deleteCategory } = require("../category/category.repository");


const {
  createExpenseService,
  getExpensesService,
  updateExpenseService,
  getExpenseByIdService,
  deleteExpenseService,
} = require("./expense.service");

const createExpense = async (req, res, next) => {
  try {
    const expense = await createExpenseService(
      req.user._id,
      req.body
    );

    return res.status(HTTP_STATUS.CREATED).json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        "Expense created successfully.",
        expense
      )
    );
  } catch (error) {
    next(error);
  }
};

const getExpenses = async (req, res, next) => {
  try {
    const expenses = await getExpensesService(
      req.user._id
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Expenses fetched successfully.",
        expenses
      )
    );
  } catch (error) {
    next(error);
  }
};

const getExpenseById = async (req, res, next) => {
  try {
    const expense = await getExpenseByIdService(
      req.user._id,
      req.params.id
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Expense fetched successfully.",
        expense
      )
    );
  } catch (error) {
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const expense = await updateExpenseService(
      req.user._id,
      req.params.id,
      req.body
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Expense updated successfully.",
        expense
      )
    );
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    await deleteExpenseService(
      req.user._id,
      req.params.id
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Expense deleted successfully.",
        null
      )
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};