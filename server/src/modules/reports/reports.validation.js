const { query } = require("express-validator");

const dateRangeReportValidation = [
  query("from")
    .notEmpty()
    .withMessage("From date is required.")
    .isISO8601()
    .withMessage("From date must be a valid date."),

  query("to")
    .notEmpty()
    .withMessage("To date is required.")
    .isISO8601()
    .withMessage("To date must be a valid date."),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than 0."),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100."),
];

const monthlyReportValidation = [
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

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than 0."),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100."),
];

const yearlyReportValidation = [
  query("year")
    .notEmpty()
    .withMessage("Year is required.")
    .isInt({ min: 2000 })
    .withMessage("Invalid year."),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than 0."),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100."),
];

const categoryReportValidation = [
  query("from")
    .notEmpty()
    .withMessage("From date is required.")
    .isISO8601()
    .withMessage("From date must be a valid date."),

  query("to")
    .notEmpty()
    .withMessage("To date is required.")
    .isISO8601()
    .withMessage("To date must be a valid date."),
];


module.exports = {
  dateRangeReportValidation,
  monthlyReportValidation,
  yearlyReportValidation,
categoryReportValidation,
  
};