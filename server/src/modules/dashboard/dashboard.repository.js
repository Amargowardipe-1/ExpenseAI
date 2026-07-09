const mongoose = require("mongoose");
const Expense = require("../expense/expense.model");
const TRANSACTION_TYPES = require("../../shared/constants/transactionTypes");

const getDashboardOverview = async (userId) => {
  return await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$transactionType",
        totalAmount: {
          $sum: "$amount",
        },
        totalTransactions: {
          $sum: 1,
        },
      },
    },
  ]);
};

const getMonthlySummary = async (
  userId,
  startDate,
  endDate
) => {
  return await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isDeleted: false,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: "$transactionType",
        totalAmount: {
          $sum: "$amount",
        },
      },
    },
  ]);
};

const getCategorySummary = async (userId) => {
  return await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isDeleted: false,
        transactionType: TRANSACTION_TYPES.EXPENSE,
      },
    },
    {
      $group: {
        _id: "$category",
        total: {
          $sum: "$amount",
        },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $project: {
        _id: 0,
        categoryId: "$category._id",
        categoryName: "$category.name",
        color: "$category.color",
        icon: "$category.icon",
        total: 1,
      },
    },
    {
      $sort: {
        total: -1,
      },
    },
  ]);
};

const getRecentTransactions = async (userId) => {
  return await Expense.find({
    user: new mongoose.Types.ObjectId(userId),
    isDeleted: false,
  })
    .populate("category", "name icon color type")
    .sort({ date: -1 })
    .limit(10);
};

const getMonthlyTrend = async (userId, year) => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

  return await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isDeleted: false,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$date" },
          type: "$transactionType",
        },
        total: {
          $sum: "$amount",
        },
      },
    },
  ]);
};

module.exports = {
  getDashboardOverview,
  getMonthlySummary,
  getCategorySummary,
  getRecentTransactions,
  getMonthlyTrend,
};