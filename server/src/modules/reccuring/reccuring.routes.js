const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");

const {
  createRecurringValidation,
  updateRecurringValidation,
  recurringIdValidation,
} = require("./recurring.validation");

const {
  createRecurring,
  getRecurringTransactions,
  getRecurringById,
  updateRecurring,
  deleteRecurring,
} = require("./recurring.controller");

router.post(
  "/",
  authMiddleware,
  createRecurringValidation,
  validate,
  createRecurring
);

router.get(
  "/",
  authMiddleware,
  getRecurringTransactions
);

router.get(
  "/:id",
  authMiddleware,
  recurringIdValidation,
  validate,
  getRecurringById
);

router.put(
  "/:id",
  authMiddleware,
  updateRecurringValidation,
  validate,
  updateRecurring
);

router.delete(
  "/:id",
  authMiddleware,
  recurringIdValidation,
  validate,
  deleteRecurring
);

module.exports = router;

