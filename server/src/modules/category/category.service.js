const ApiError = require("../../shared/errors/ApiError");
const HTTP_STATUS = require("../../shared/constants/httpStatus");

const {
  createCategory,
  findCategoryByName,
  findCategoryById,
  getCategories,
 findCategoryByNameExceptId,
 deleteCategory,
} = require("./category.repository");


const createCategoryService = async (userId, categoryData) => {
  const { name, type } = categoryData;

  const existingCategory = await findCategoryByName(
    userId,
    name,
    type
  );

  if (existingCategory) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      "Category already exists."
    );
  }

  const category = await createCategory({
    ...categoryData,
    user: userId,
  });

  return category;
};

const getCategoriesService = async (userId, type) => {
  return await getCategories(userId, type);
};

const getCategoryByIdService = async (userId, categoryId) => {
  const category = await findCategoryById(userId, categoryId);

  if (!category) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Category not found."
    );
  }

  return category;
};

const updateCategoryService = async (
  userId,
  categoryId,
  updateData
) => {
  const category = await findCategoryById(
    userId,
    categoryId
  );

  if (!category) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Category not found."
    );
  }

  const duplicateCategory =
    await findCategoryByNameExceptId(
      userId,
      categoryId,
      updateData.name,
      updateData.type || category.type
    );

  if (duplicateCategory) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      "Category already exists."
    );
  }

  delete updateData.isDefault;
  delete updateData.isActive;

  const updatedCategory = await updateCategory(
    categoryId,
    updateData
  );

  return updatedCategory;
};


const deleteCategoryService = async (
  userId,
  categoryId
) => {
  const category = await findCategoryById(
    userId,
    categoryId
  );

  if (!category) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Category not found."
    );
  }

  await deleteCategory(categoryId);

  return null;
};

module.exports = {
  createCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
};