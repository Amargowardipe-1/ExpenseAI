const HTTP_STATUS = require("../../shared/constants/httpStatus");
const ApiResponse = require("../../shared/utils/ApiResponse");
const { getAnalyticsDataService } = require("./analytics.service");

const getAnalytics = async (req, res, next) => {
  try {
    const { mode, year, month, weekStart } = req.query;

    const data = await getAnalyticsDataService({
      userId: req.user._id,
      mode: mode || "monthly",
      year: Number(year) || new Date().getFullYear(),
      month: month !== undefined ? Number(month) : new Date().getMonth(),
      weekStart: weekStart,
    });

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Analytics data fetched successfully.",
        data
      )
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
};
