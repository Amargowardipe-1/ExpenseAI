const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");

const {
  createBudgetValidation,
  updateBudgetValidation,
  budgetIdValidation,
  currentBudgetValidation,
} = require("./budget.validation");

const {
  createBudget,
  getCurrentBudget,
  updateBudget,
  deleteBudget,
  getBudgetProgress,
} = require("./budget.controller");

router.post(
  "/",
  authMiddleware,
  createBudgetValidation,
  validate,
  createBudget
);

router.get(
  "/current",
  authMiddleware,
  currentBudgetValidation,
  validate,
  getCurrentBudget
);

router.put(
  "/:id",
  authMiddleware,
  updateBudgetValidation,
  validate,
  updateBudget
);

router.delete(
  "/:id",
  authMiddleware,
  budgetIdValidation,
  validate,
  deleteBudget
);

router.get(
  "/progress",
  authMiddleware,
  currentBudgetValidation,
  validate,
  getBudgetProgress
);

module.exports = router;