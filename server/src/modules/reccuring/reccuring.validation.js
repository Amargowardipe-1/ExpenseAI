const { body, param } = require("express-validator");

const RECURRING_FREQUENCIES = require("../../shared/constants/recurringFrequencies");
const TRANSACTION_TYPES = require("../../shared/constants/transactionTypes");

const createRecurringValidation = [
  body("category")
    .notEmpty()
    .withMessage("Category is required.")
    .isMongoId()
    .withMessage("Invalid category id."),

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required."),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required.")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0."),

  body("transactionType")
    .notEmpty()
    .withMessage("Transaction type is required.")
    .isIn(Object.values(TRANSACTION_TYPES))
    .withMessage("Invalid transaction type."),

  body("paymentMethod")
    .trim()
    .notEmpty()
    .withMessage("Payment method is required."),

  body("note")
    .optional()
    .trim(),

  body("frequency")
    .notEmpty()
    .withMessage("Frequency is required.")
    .isIn(Object.values(RECURRING_FREQUENCIES))
    .withMessage("Invalid frequency."),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required.")
    .isISO8601()
    .withMessage("Invalid start date."),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid end date."),
];

const updateRecurringValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid recurring transaction id."),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category id."),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty."),

  body("amount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0."),

  body("transactionType")
    .optional()
    .isIn(Object.values(TRANSACTION_TYPES))
    .withMessage("Invalid transaction type."),

  body("paymentMethod")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Payment method cannot be empty."),

  body("note")
    .optional()
    .trim(),

  body("frequency")
    .optional()
    .isIn(Object.values(RECURRING_FREQUENCIES))
    .withMessage("Invalid frequency."),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid start date."),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid end date."),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be boolean."),
];

const recurringIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid recurring transaction id."),
];

module.exports = {
  createRecurringValidation,
  updateRecurringValidation,
  recurringIdValidation,
};