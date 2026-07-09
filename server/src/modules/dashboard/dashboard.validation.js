const { query } = require("express-validator");

const monthlySummaryValidation = [
  query("month")
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12."),

  query("year")
    .optional()
    .isInt({ min: 2000 })
    .withMessage("Invalid year."),
];

module.exports = {
  monthlySummaryValidation,
};