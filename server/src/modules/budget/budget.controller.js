const HTTP_STATUS = require("../../shared/constants/httpStatus");
const ApiResponse = require("../../shared/utils/ApiResponse");

const {
  createBudgetService,
  getCurrentBudgetService,
  updateBudgetService,
  deleteBudgetService,
  getBudgetProgressService,
} = require("./budget.service");

const createBudget = async (req, res, next) => {
  try {
    const budget = await createBudgetService(
      req.user._id,
      req.body
    );

    return res.status(HTTP_STATUS.CREATED).json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        "Budget created successfully.",
        budget
      )
    );
  } catch (error) {
    next(error);
  }
};

const getCurrentBudget = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    const budget = await getCurrentBudgetService(
      req.user._id,
      Number(month),
      Number(year)
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Budget fetched successfully.",
        budget
      )
    );
  } catch (error) {
    next(error);
  }
};

const updateBudget = async (req, res, next) => {
  try {
    const budget = await updateBudgetService(
      req.params.id,
      req.body
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Budget updated successfully.",
        budget
      )
    );
  } catch (error) {
    next(error);
  }
};

const deleteBudget = async (req, res, next) => {
  try {
    await deleteBudgetService(req.params.id);

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Budget deleted successfully."
      )
    );
  } catch (error) {
    next(error);
  }
};

const getBudgetProgress = async (
  req,
  res,
  next
) => {
  try {
    const { month, year } = req.query;

    const progress =
      await getBudgetProgressService(
        req.user._id,
        Number(month),
        Number(year)
      );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Budget progress fetched successfully.",
        progress
      )
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBudget,
  getCurrentBudget,
  updateBudget,
  deleteBudget,
  getBudgetProgress,
};