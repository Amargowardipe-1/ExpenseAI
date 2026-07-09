const express = require("express");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("./category.controller");

const {
  createCategoryValidation,
    updateCategoryValidation,
     
} = require("./category.validation");

const validate = require("../../middlewares/validate.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createCategoryValidation,
  validate,
  createCategory
);

router.get(
  "/",
  authMiddleware,
  getCategories
);

router.get(
  "/:id",
  authMiddleware,
  getCategoryById
);

router.put(
  "/:id",
  authMiddleware,
  updateCategoryValidation,
  validate,
  updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  deleteCategory
);

module.exports = router;