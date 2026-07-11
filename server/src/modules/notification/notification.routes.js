const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");

const {
  notificationIdValidation,
  paginationValidation,
} = require("./notification.validation");

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("./notification.controller");

router.get(
  "/",
  authMiddleware,
  paginationValidation,
  validate,
  getNotifications
);

router.get(
  "/unread-count",
  authMiddleware,
  getUnreadCount
);

router.patch(
  "/:id/read",
  authMiddleware,
  notificationIdValidation,
  validate,
  markAsRead
);

router.patch(
  "/read-all",
  authMiddleware,
  markAllAsRead
);

router.delete(
  "/:id",
  authMiddleware,
  notificationIdValidation,
  validate,
  deleteNotification
);

module.exports = router;