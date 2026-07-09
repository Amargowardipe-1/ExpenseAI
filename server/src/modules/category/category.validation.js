const { body } = require("express-validator");

const createCategoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters."),

  body("type")
    .notEmpty()
    .withMessage("Category type is required.")
    .isIn(["expense", "income"])
    .withMessage("Category type must be either expense or income."),

  body("icon")
    .trim()
    .notEmpty()
    .withMessage("Category icon is required."),

  body("color")
    .trim()
    .notEmpty()
    .withMessage("Category color is required.")
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage("Invalid color format."),
];

const updateCategoryValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters."),

  body("type")
    .optional()
    .isIn(["expense", "income"])
    .withMessage("Category type must be either expense or income."),

  body("icon")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category icon cannot be empty."),

  body("color")
    .optional()
    .trim()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage("Invalid color format."),
];

module.exports = {
  createCategoryValidation,
  updateCategoryValidation,
};