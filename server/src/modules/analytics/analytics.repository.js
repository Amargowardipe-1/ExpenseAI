const mongoose = require("mongoose");
const Expense = require("../expense/expense.model");
const TRANSACTION_TYPES = require("../../shared/constants/transactionTypes");

/**
 * getTrendDataDb — Aggregates income and expense sums grouped by date segments
 */
const getTrendDataDb = async (userId, startDate, endDate, groupBy) => {
  let groupField;
  if (groupBy === "month") {
    groupField = { $month: "$date" };
  } else if (groupBy === "day") {
    groupField = { $dayOfMonth: "$date" };
  } else {
    // dayOfWeek: 1 (Sun) to 7 (Sat)
    groupField = { $dayOfWeek: "$date" };
  }

  return await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isDeleted: false,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: {
          segment: groupField,
          type: "$transactionType",
        },
        total: { $sum: "$amount" },
      },
    },
  ]);
};

/**
 * getCategorySummaryDb — Aggregates expense sums grouped by categories
 */
const getCategorySummaryDb = async (userId, startDate, endDate) => {
  return await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isDeleted: false,
        transactionType: TRANSACTION_TYPES.EXPENSE,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
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
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        categoryId: { $ifNull: ["$category._id", "$_id"] },
        categoryName: { $ifNull: ["$category.name", "Uncategorized"] },
        color: { $ifNull: ["$category.color", "#64748B"] },
        icon: { $ifNull: ["$category.icon", "tag-outline"] },
        total: 1,
      },
    },
    {
      $sort: { total: -1 },
    },
  ]);
};

module.exports = {
  getTrendDataDb,
  getCategorySummaryDb,
};
