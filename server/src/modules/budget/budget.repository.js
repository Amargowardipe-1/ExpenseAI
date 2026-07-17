const Budget = require("./budget.model");

const createBudget = async (budgetData) => {
  return await Budget.create(budgetData);
};

const findBudgetById = async (budgetId) => {
  return await Budget.findById(budgetId);
};

const findBudgetByUserAndMonth = async (
  userId,
  month,
  year
) => {
  return await Budget.findOne({
    user: userId,
    month,
    year,
  });
};

const updateBudget = async (
  budgetId,
  updateData
) => {
  return await Budget.findByIdAndUpdate(
    budgetId,
    updateData,
    {
      returnDocument: "after",
      runValidators: true,
    }
  );
};

const deleteBudget = async (budgetId) => {
  return await Budget.findByIdAndDelete(
    budgetId
  );
};

module.exports = {
  createBudget,
  findBudgetById,
  findBudgetByUserAndMonth,
  updateBudget,
  deleteBudget,
};