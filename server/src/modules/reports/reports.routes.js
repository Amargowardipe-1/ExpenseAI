const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");

const {
  dateRangeReportValidation,
  monthlyReportValidation,
  yearlyReportValidation,
  categoryReportValidation,
} = require("./reports.validation");

const {
  getDateRangeReport,
  getMonthlyReport,
  getYearlyReport,
  getCategoryReport,
} = require("./reports.controller");

router.get(
  "/date-range",
  authMiddleware,
  dateRangeReportValidation,
  validate,
  getDateRangeReport
);

router.get(
  "/monthly",
  authMiddleware,
  monthlyReportValidation,
  validate,
  getMonthlyReport
);

router.get(
  "/yearly",
  authMiddleware,
  yearlyReportValidation,
  validate,
  getYearlyReport
);

router.get(
  "/category",
  authMiddleware,
  categoryReportValidation,
  validate,
  getCategoryReport
);

module.exports = router;