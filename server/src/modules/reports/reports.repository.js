const Expense = require("../expense/expense.model");
const mongoose = require("mongoose");

const getReportByDateRange = async (
  userId,
  startDate,
  endDate,
  skip,
  limit
) => {
  const result = await Expense.aggregate([
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
      $facet: {
        summary: [
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
        ],

        transactions: [
          {
            $sort: {
              date: -1,
            },
          },

          {
            $skip: skip,
          },

          {
            $limit: limit,
          },

          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "category",
            },
          },

          {
            $unwind: "$category",
          },

          {
            $project: {
              title: 1,
              amount: 1,
              paymentMethod: 1,
              transactionType: 1,
              date: 1,
              note: 1,

              category: {
                _id: "$category._id",
                name: "$category.name",
                icon: "$category.icon",
                color: "$category.color",
              },
            },
          },
        ],

        totalRecords: [
          {
            $count: "count",
          },
        ],
      },
    },
  ]);

  return result[0];
};

const getCategoryReport = async (
  userId,
  startDate,
  endDate
) => {
  return await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
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
        _id: "$category",
        totalAmount: {
          $sum: "$amount",
        },
        totalTransactions: {
          $sum: 1,
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
      $sort: {
        totalAmount: -1,
      },
    },
    {
      $project: {
        _id: 0,
        categoryId: "$category._id",
        categoryName: "$category.name",
        icon: "$category.icon",
        color: "$category.color",
        totalAmount: 1,
        totalTransactions: 1,
      },
    },
  ]);
};

module.exports = {
  getReportByDateRange,
  getCategoryReport,
};