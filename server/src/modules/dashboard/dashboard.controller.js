const HTTP_STATUS = require("../../shared/constants/httpStatus");
const ApiResponse = require("../../shared/utils/ApiResponse");

const {
  getDashboardOverviewService,
  getMonthlySummaryService,
  getCategorySummaryService,
  getRecentTransactionsService,
  getMonthlyTrendService,
} = require("./dashboard.service");

const getDashboardOverview = async (req, res, next) => {
  try {
    const overview = await getDashboardOverviewService(
      req.user._id
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Dashboard overview fetched successfully.",
        overview
      )
    );
  } catch (error) {
    next(error);
  }
};

const getMonthlySummary = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    const summary = await getMonthlySummaryService(
      req.user._id,
      Number(month),
      Number(year)
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Monthly summary fetched successfully.",
        summary
      )
    );
  } catch (error) {
    next(error);
  }
};

const getCategorySummary = async (req, res, next) => {
  try {
    const summary = await getCategorySummaryService(
      req.user._id
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Category summary fetched successfully.",
        summary
      )
    );
  } catch (error) {
    next(error);
  }
};

const getRecentTransactions = async (req, res, next) => {
  try {
    const transactions = await getRecentTransactionsService(
      req.user._id
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Recent transactions fetched successfully.",
        transactions
      )
    );
  } catch (error) {
    next(error);
  }
};

const getMonthlyTrend = async (req, res, next) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();

    const trend = await getMonthlyTrendService(
      req.user._id,
      year
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Monthly trend fetched successfully.",
        trend
      )
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardOverview,
  getMonthlySummary,
  getCategorySummary,
  getRecentTransactions,
  getMonthlyTrend,
};