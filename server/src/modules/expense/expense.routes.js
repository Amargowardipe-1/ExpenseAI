const express = require("express");

const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  
} = require("./expense.controller");

const {
  createExpenseValidation,
  updateExpenseValidation,
} = require("./expense.validation");

const authMiddleware = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");

const router = express.Router();


router.post(
  "/",
  authMiddleware,
  createExpenseValidation,
  validate,
  createExpense
);

router.get(
  "/",
  authMiddleware,
  getExpenses
);

router.get(
  "/:id",
  authMiddleware,
  getExpenseById
);

router.put(
  "/:id",
  authMiddleware,
  updateExpenseValidation,
  validate,
  updateExpense
);

router.delete(
  "/:id",
  authMiddleware,
  deleteExpense
);

module.exports = router;