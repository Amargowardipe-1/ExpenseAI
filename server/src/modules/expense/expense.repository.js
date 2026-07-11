const Expense = require("./expense.model");
const TRANSACTION_TYPES = require("../../shared/constants/transactionTypes");

const createExpense = async (expenseData) => {
  return await Expense.create(expenseData);
};

const findExpenseById = async (userId, expenseId) => {
  return await Expense.findOne({
    _id: expenseId,
    user: userId,
    isDeleted: false,
  }).populate("category", "name icon color type");
};

const getExpenses = async (userId) => {
  return await Expense.find({
    user: userId,
    isDeleted: false,
  })
    .populate("category")
    .sort({ date: -1 });
};



const deleteExpense = async (expenseId) => {
  return await Expense.findByIdAndUpdate(
    expenseId,
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );
};

const updateExpense = async (expenseId, updateData) => {
  return await Expense.findByIdAndUpdate(
    expenseId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).populate("category", "name icon color type");
};

const getTotalExpenseByDateRange = async (
  userId,
  startDate,
  endDate
) => {
  const result = await Expense.aggregate([
    {
      $match: {
        user: userId,
        isDeleted: false,
        transactionType: TRANSACTION_TYPES.EXPENSE,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalExpense: {
          $sum: "$amount",
        },
      },
    },
  ]);

  return result[0]?.totalExpense || 0;
};

const findRecurringExpense = async (
  recurringTransaction,
  date
) => {
  return await Expense.findOne({
    recurringTransaction,
    date,
  });
};


module.exports = {
  createExpense,
  findExpenseById,
  getExpenses,
  updateExpense,
  deleteExpense,
  getTotalExpenseByDateRange,
  findRecurringExpense,
};