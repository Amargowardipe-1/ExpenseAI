const RecurringTransaction = require("./recurring.model");

const createRecurring = async (recurringData) => {
  return await RecurringTransaction.create(recurringData);
};

const findRecurringById = async (recurringId) => {
  return await RecurringTransaction.findById(recurringId)
    .populate("category");
};

const getRecurringTransactions = async (userId) => {
  return await RecurringTransaction.find({
    user: userId,
  })
    .populate("category")
    .sort({ createdAt: -1 });
};

const updateRecurring = async (
  recurringId,
  updateData
) => {
  return await RecurringTransaction.findByIdAndUpdate(
    recurringId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).populate("category");
};

const deleteRecurring = async (recurringId) => {
  return await RecurringTransaction.findByIdAndDelete(
    recurringId
  );
};

const getDueRecurringTransactions = async (
  currentDate
) => {
  return await RecurringTransaction.find({
    isActive: true,
    nextRunDate: {
      $lte: currentDate,
    },
    $or: [
      {
        endDate: null,
      },
      {
        endDate: {
          $gte: currentDate,
        },
      },
    ],
  }).populate("category");
};

module.exports = {
  createRecurring,
  findRecurringById,
  getRecurringTransactions,
  updateRecurring,
  deleteRecurring,
  getDueRecurringTransactions,
};