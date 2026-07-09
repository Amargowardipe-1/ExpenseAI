const Category = require("./category.model");

const createCategory = async (categoryData) => {
  return await Category.create(categoryData);
};

const findCategoryById = async (userId, categoryId) => {
  return await Category.findOne({
    _id: categoryId,
    user: userId,
    isActive: true,
  });
};

const findCategoryByName = async (userId, name, type) => {
  return await Category.findOne({
    user: userId,
    type,
    name: new RegExp(`^${name}$`, "i"),
  });
};

const getCategories = async (userId, type) => {
  const filter = {
    user: userId,
    isActive: true,
  };

  if (type) {
    filter.type = type;
  }

  return await Category.find(filter).sort({ name: 1 });
};

const updateCategory = async (categoryId, updateData) => {
  return await Category.findByIdAndUpdate(
    categoryId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

const deleteCategory = async (categoryId) => {
  return await Category.findByIdAndUpdate(
    categoryId,
    {
      isActive: false,
    },
    {
      new: true,
    }
  );
};

const findCategoryByNameExceptId = async (
  userId,
  categoryId,
  name,
  type
) => {
  return await Category.findOne({
    user: userId,
    type,
    name: new RegExp(`^${name}$`, "i"),
    _id: {
      $ne: categoryId,
    },
  });
};




module.exports = {
  createCategory,
  findCategoryById,
  findCategoryByName,
  getCategories,
  updateCategory,
  deleteCategory,
  findCategoryByName,
  findCategoryByNameExceptId,
};