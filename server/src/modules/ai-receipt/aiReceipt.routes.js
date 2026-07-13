const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const upload = require("../../middlewares/upload.middleware");

const {
  analyzeReceiptValidation,
} = require("./aiReceipt.validation");

const {
  uploadReceipt,
} = require("./aiReceipt.controller");

router.post(
  "/upload",
  authMiddleware,
  upload.single("receipt"),
  analyzeReceiptValidation,
  validate,
  uploadReceipt
);

module.exports = router;