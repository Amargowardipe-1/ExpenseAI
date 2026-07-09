const HTTP_STATUS = require("../../shared/constants/httpStatus");
const ApiResponse = require("../../shared/utils/ApiResponse");

const {
  createCategoryService,
  getCategoriesService,
    updateCategoryService,
    deleteCategoryService,
} = require("./category.service");


const createCategory = async (req, res, next) => {
  try {
    const category = await createCategoryService(
      req.user._id,
      req.body
    );

    return res.status(HTTP_STATUS.CREATED).json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        "Category created successfully.",
        category
      )
    );
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const { type } = req.query;

    const categories = await getCategoriesService(
      req.user._id,
      type
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Categories fetched successfully.",
        categories
      )
    );
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await getCategoryByIdService(
      req.user._id,
      req.params.id
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Category fetched successfully.",
        category
      )
    );
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await updateCategoryService(
      req.user._id,
      req.params.id,
      req.body
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Category updated successfully.",
        category
      )
    );
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await deleteCategoryService(
      req.user._id,
      req.params.id
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Category deleted successfully.",
        null
      )
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};