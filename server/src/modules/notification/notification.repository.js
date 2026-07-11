const Notification = require("./notification.model");
const NOTIFICATION_TYPES = require("../../shared/constants/notificationTypes");

const createNotification = async (notificationData) => {
  return await Notification.create(notificationData);
};

const getNotifications = async (
  userId,
  skip,
  limit
) => {
  return await Notification.find({
    user: userId,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

const getUnreadCount = async (userId) => {
  return await Notification.countDocuments({
    user: userId,
    isRead: false,
  });
};

const findNotificationByIdAndUser = async (
  notificationId,
  userId
) => {
  return await Notification.findOne({
    _id: notificationId,
    user: userId,
  });
};

const markAsRead = async (
  notificationId,
  userId
) => {
  return await Notification.findByIdAndUpdate(
  { _id: notificationId,
    user: userId,
  },
    {
      isRead: true,
    },
    {
      new: true,
    }
  );
};

const markAllAsRead = async (userId) => {
  return await Notification.updateMany(
    {
      user: userId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
      },
    }
  );
};

const deleteNotification = async (
  notificationId, 
  userId
) => {
  return await Notification.findByIdAndDelete(
   { _id: notificationId,
    user: userId,
   },
  );
};

const getNotificationCount = async (
  userId
) => {
  return await Notification.countDocuments({
    user: userId,
  });
};



const findBudgetNotification = async (
  userId,
  type,
  month,
  year
) => {
  return await Notification.findOne({
    user: userId,
    type,
    "metadata.month": month,
    "metadata.year": year,
  });
};

const findRecurringNotification = async (
  recurringId,
  expenseId
) => {
  return await Notification.findOne({
    type: NOTIFICATION_TYPES.RECURRING_CREATED,
    "metadata.recurringId": recurringId,
    "metadata.expenseId": expenseId,
  });
};

module.exports = {
  createNotification,
  getNotifications,
  getUnreadCount,
  findNotificationByIdAndUser,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationCount,
   findBudgetNotification,
   findRecurringNotification,
};