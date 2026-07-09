const { body } = require("express-validator");

const PAYMENT_METHODS = require("../../shared/constants/paymentMethods");
const TRANSACTION_TYPES = require("../../shared/constants/transactionTypes");

const createExpenseValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters."),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required.")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0."),

  body("category")
    .notEmpty()
    .withMessage("Category is required.")
    .isMongoId()
    .withMessage("Invalid category id."),

  body("transactionType")
    .notEmpty()
    .withMessage("Transaction type is required.")
    .isIn(Object.values(TRANSACTION_TYPES))
    .withMessage("Invalid transaction type."),

  body("paymentMethod")
    .optional()
    .isIn(Object.values(PAYMENT_METHODS))
    .withMessage("Invalid payment method."),

  body("note")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Note cannot exceed 500 characters."),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format."),
];

const updateExpenseValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters."),

  body("amount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0."),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category id."),

  body("transactionType")
    .optional()
    .isIn(Object.values(TRANSACTION_TYPES))
    .withMessage("Invalid transaction type."),

  body("paymentMethod")
    .optional()
    .isIn(Object.values(PAYMENT_METHODS))
    .withMessage("Invalid payment method."),

  body("note")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Note cannot exceed 500 characters."),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format."),
];

module.exports = {
  createExpenseValidation,
  updateExpenseValidation,
};