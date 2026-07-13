const { body } = require("express-validator");

const analyzeReceiptValidation = [
  body("source")
    .optional()
    .isIn([
      "gallery",
      "camera",
      "share",
    ])
    .withMessage(
      "Source must be gallery, camera or share."
    ),
];

module.exports = {
  analyzeReceiptValidation,
};