const TRANSACTION_TYPES = require("../../shared/constants/transactionTypes");

const {
  getDashboardOverview,
  getMonthlySummary,
  getCategorySummary,
  getRecentTransactions,
  getMonthlyTrend,
} = require("./dashboard.repository");

const getDashboardOverviewService = async (userId) => {
  const overview = await getDashboardOverview(userId);

  let totalIncome = 0;
  let totalExpense = 0;
  let totalTransactions = 0;

  overview.forEach((item) => {
    if (item._id === TRANSACTION_TYPES.INCOME) {
      totalIncome = item.totalAmount;
    }

    if (item._id === TRANSACTION_TYPES.EXPENSE) {
      totalExpense = item.totalAmount;
    }

    totalTransactions += item.totalTransactions;
  });

  return {
    totalIncome,
    totalExpense,
    totalBalance: totalIncome - totalExpense,
    totalTransactions,
  };
};

const getMonthlySummaryService = async (
  userId,
  month,
  year
) => {
  const startDate = new Date(year, month - 1, 1);

  const endDate = new Date(year, month, 0);
  endDate.setHours(23, 59, 59, 999);

  const summary = await getMonthlySummary(
    userId,
    startDate,
    endDate
  );

  let income = 0;
  let expense = 0;

  summary.forEach((item) => {
    if (item._id === TRANSACTION_TYPES.INCOME) {
      income = item.totalAmount;
    }

    if (item._id === TRANSACTION_TYPES.EXPENSE) {
      expense = item.totalAmount;
    }
  });

  return {
    income,
    expense,
    balance: income - expense,
  };
};

const getCategorySummaryService = async (userId) => {
  const summary = await getCategorySummary(userId);

  return summary;
};

const getRecentTransactionsService = async (userId) => {
  return await getRecentTransactions(userId);
};

const getMonthlyTrendService = async (userId, year) => {
  const results = await getMonthlyTrend(userId, year);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const trend = monthNames.map((month) => ({
    month,
    income: 0,
    expense: 0,
  }));

  results.forEach((item) => {
    const monthIndex = item._id.month - 1; // 1-indexed (1 to 12)
    if (monthIndex >= 0 && monthIndex < 12) {
      if (item._id.type === TRANSACTION_TYPES.INCOME) {
        trend[monthIndex].income = item.total;
      } else if (item._id.type === TRANSACTION_TYPES.EXPENSE) {
        trend[monthIndex].expense = item.total;
      }
    }
  });

  return trend;
};

module.exports = {
  getDashboardOverviewService,
  getMonthlySummaryService,
  getCategorySummaryService,
  getRecentTransactionsService,
  getMonthlyTrendService,
};