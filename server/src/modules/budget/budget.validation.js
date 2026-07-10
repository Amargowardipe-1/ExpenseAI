const { body, param, query } = require("express-validator");

const createBudgetValidation = [
  body("month")
    .notEmpty()
    .withMessage("Month is required.")
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12."),

  body("year")
    .notEmpty()
    .withMessage("Year is required.")
    .isInt({ min: 2000 })
    .withMessage("Invalid year."),

  body("amount")
    .notEmpty()
    .withMessage("Budget amount is required.")
    .isFloat({ gt: 0 })
    .withMessage("Budget amount must be greater than 0."),
];

const updateBudgetValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid budget id."),

  body("month")
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12."),

  body("year")
    .optional()
    .isInt({ min: 2000 })
    .withMessage("Invalid year."),

  body("amount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Budget amount must be greater than 0."),
];

const budgetIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid budget id."),
];

const currentBudgetValidation = [
  query("month")
    .notEmpty()
    .withMessage("Month is required.")
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12."),

  query("year")
    .notEmpty()
    .withMessage("Year is required.")
    .isInt({ min: 2000 })
    .withMessage("Invalid year."),
];

module.exports = {
  createBudgetValidation,
  updateBudgetValidation,
  budgetIdValidation,
  currentBudgetValidation,
};