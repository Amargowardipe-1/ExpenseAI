const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const { monthlySummaryValidation } = require("./dashboard.validation");

const {
  getDashboardOverview,
  getMonthlySummary,
  getCategorySummary,
  getRecentTransactions,
  getMonthlyTrend,
} = require("./dashboard.controller");

const router = express.Router();

router.get(
  "/overview",
  authMiddleware,
  getDashboardOverview
);

router.get(
  "/monthly-summary",
  authMiddleware,
  monthlySummaryValidation,
  getMonthlySummary
);

router.get(
  "/category-summary",
  authMiddleware,
  getCategorySummary
);

router.get(
  "/recent-transactions",
  authMiddleware,
  getRecentTransactions
);

router.get(
  "/monthly-trend",
  authMiddleware,
  getMonthlyTrend
);

module.exports = router;
