const { param, query } = require("express-validator");

const notificationIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid notification id."),
];

const paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than 0."),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100."),
];

module.exports = {
  notificationIdValidation,
  paginationValidation,
};