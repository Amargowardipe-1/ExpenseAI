const ApiError = require("../../shared/utils/ApiError");
const HTTP_STATUS = require("../../shared/constants/httpStatus");
const TRANSACTION_TYPES = require("../../shared/constants/transactionTypes");
const { getDateRange } = require("../../shared/utils/dateRange");
const { getMonthRange } = require("../../shared/utils/dateRange");
const { getYearRange } = require("../../shared/utils/dateRange");

const {
  getCategoryReport,
} = require("./reports.repository");


const {
    getReportByDateRange,
} = require("./reports.repository");

const {
  getDateRange,
} = require("../../shared/utils/dateRange");



const getDateRangeReportService = async (
    userId,
    from,
    to,
    pageNumber,
    limit
) => {


    const { startDate, endDate } = getDateRange(
        from,
        to
    );


    if (startDate > endDate) {
        throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            "'From' date cannot be greater than 'To' date."
        );
    }

    const page = Number(pageNumber) || 1;
    const limitValue = Number(limit) || 20;
    const skip = (page - 1) * limitValue;

    const report = await getReportByDateRange(
        userId,
        startDate,
        endDate,
        skip,
        limitValue
    );

    let income = 0;
    let expense = 0;
    let totalTransactions = 0;

    report.summary.forEach((item) => {
        totalTransactions += item.totalTransactions;

        if (item._id === TRANSACTION_TYPES.INCOME) {
            income = item.totalAmount;
        }

        if (item._id === TRANSACTION_TYPES.EXPENSE) {
            expense = item.totalAmount;
        }
    });

    const totalRecords =
        report.totalRecords.length > 0
            ? report.totalRecords[0].count
            : 0;

    return {
        summary: {
            income,
            expense,
            balance: income - expense,
            totalTransactions,
        },

        transactions: report.transactions,

        pagination: {
            page,
            limit: limitValue,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limitValue),
        },
    };
};

const getMonthlyReportService = async (
    userId,
    month,
    year,
    page,
    limit
) => {

    const { startDate, endDate } = getMonthRange(
        month,
        year
    );

    return await getDateRangeReportService(
        userId,
        startDate.toISOString(),
        endDate.toISOString(),
        page,
        limit
    );
};

const getYearlyReportService = async (
  userId,
  year,
  page,
  limit
) => {
  const { startDate, endDate } = getYearRange(year);

  return await getDateRangeReportService(
    userId,
    startDate.toISOString(),
    endDate.toISOString(),
    page,
    limit
  );
};

const getCategoryReportService = async (
  userId,
  from,
  to
) => {
  const { startDate, endDate } = getDateRange(from, to);

  if (startDate > endDate) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "'From' date cannot be greater than 'To' date."
    );
  }

  const categories = await getCategoryReport(
    userId,
    startDate,
    endDate
  );

  const totalExpense = categories.reduce(
    (sum, category) => sum + category.totalAmount,
    0
  );

  const categorySummary = categories.map((category) => ({
    ...category,
    percentage:
      totalExpense === 0
        ? 0
        : Number(
            (
              (category.totalAmount / totalExpense) *
              100
            ).toFixed(2)
          ),
  }));

  return {
    totalExpense,
    totalCategories: categorySummary.length,
    categories: categorySummary,
  };
};

module.exports = {
    getDateRangeReportService,
    getMonthlyReportService,
     getYearlyReportService,
    getCategoryReportService,
};