const { body } = require("express-validator");

const analyzeVoiceValidation = [
  body("language")
    .optional()
    .isIn([
      "en",
      "hi",
      "hinglish",
      "auto",
    ])
    .withMessage(
      "Language must be en, hi, hinglish or auto."
    ),
];

module.exports = {
  analyzeVoiceValidation,
};