const express = require("express");
const authMiddleware = require("../../middlewares/auth.middleware");

const { getAnalytics } = require("./analytics.controller");

const router = express.Router();

router.get("/", authMiddleware, getAnalytics);

module.exports = router;
