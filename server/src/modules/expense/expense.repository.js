const Expense = require("./expense.model");

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

module.exports = {
  createExpense,
  findExpenseById,
  getExpenses,
  updateExpense,
  deleteExpense,
};