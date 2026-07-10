const HTTP_STATUS = require("../../shared/constants/httpStatus");
const ApiResponse = require("../../shared/utils/ApiResponse");

const {
  getDateRangeReportService,
} = require("./reports.service");

const {
  getCategoryReportService,
} = require("./reports.service");

const getDateRangeReport = async (
  req,
  res,
  next
) => {
  try {
    const { from, to } = req.query;

    const report =
      await getDateRangeReportService(
        req.user._id,
        from,
        to
      );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Date range report fetched successfully.",
        report
      )
    );
  } catch (error) {
    next(error);
  }
};

const getMonthlyReport = async (req, res, next) => {
  try {
    const { month, year, page, limit } = req.query;

    const report = await getMonthlyReportService(
      req.user._id,
      Number(month),
      Number(year),
      page,
      limit
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Monthly report fetched successfully.",
        report
      )
    );
  } catch (error) {
    next(error);
  }
};

const getCategoryReport = async (
  req,
  res,
  next
) => {
  try {
    const { from, to } = req.query;

    const report = await getCategoryReportService(
      req.user._id,
      from,
      to
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Category report fetched successfully.",
        report
      )
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDateRangeReport,
  getMonthlyReport,
  getCategoryReport,
};