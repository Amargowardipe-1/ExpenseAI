const express = require("express");

const {
  analyzeVoiceController,
} = require("./aiVoice.controller");

const {
  analyzeVoiceValidation,
} = require("./aiVoice.validation");

const {
  uploadAudio,
} = require("../../middlewares/upload.middleware");

const verifyToken = require("../../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/analyze",
  verifyToken,
  uploadAudio.single("audio"),
  analyzeVoiceValidation,
  analyzeVoiceController
);

module.exports = router;