const HTTP_STATUS = require("../../shared/constants/httpStatus");
const ApiError = require("../../shared/errors/ApiError");
const NOTIFICATION_TYPES = require("../../shared/constants/notificationTypes");

const {
    createNotification,
    getNotifications,
    getUnreadCount,
    getNotificationCount,
    findNotificationByIdAndUser,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    findBudgetNotification,
    findRecurringNotification,
} = require("./notification.repository");

const createNotificationService = async (
    notificationData
) => {
    return await createNotification(notificationData);
};

const getNotificationsService = async (
    userId,
    pageNumber,
    limit
) => {
    const page = Number(pageNumber) || 1;
    const limitValue = Number(limit) || 20;

    const skip = (page - 1) * limitValue;

    const notifications =
        await getNotifications(
            userId,
            skip,
            limitValue
        );

    const totalRecords =
        await getNotificationCount(userId);

    return {
        notifications,
        pagination: {
            page,
            limit: limitValue,
            totalRecords,
            totalPages: Math.ceil(
                totalRecords / limitValue
            ),
        },
    };
};

const getUnreadCountService = async (
    userId
) => {
    return await getUnreadCount(userId);
};

const markAsReadService = async (
    notificationId,
    userId
) => {
    const notification =
        await findNotificationByIdAndUser(
            notificationId,
            userId
        );

    if (!notification) {
        throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            "Notification not found."
        );
    }

    if (
        notification.user.toString() !==
        userId.toString()
    ) {
        throw new ApiError(
            HTTP_STATUS.FORBIDDEN,
            "You are not authorized to access this notification."
        );
    }

    return await markAsRead(notificationId);
};

const markAllAsReadService = async (
    userId
) => {
    return await markAllAsRead(userId);
};

const deleteNotificationService = async (
    notificationId,
    userId
) => {
    const notification =
        await findNotificationByIdAndUser(
            notificationId,
            userId
        );

    if (!notification) {
        throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            "Notification not found."
        );
    }

    if (
        notification.user.toString() !==
        userId.toString()
    ) {
        throw new ApiError(
            HTTP_STATUS.FORBIDDEN,
            "You are not authorized to access this notification."
        );
    }

    await deleteNotification(notificationId);
};

//createBudgetNotificationService
const createBudgetNotificationService = async (
  userId,
  type,
  title,
  message,
  month,
  year
) => {
  const notification =
    await findBudgetNotification(
      userId,
      type,
      month,
      year
    );

  if (notification) {
    return;
  }

  return await createNotificationService({
    user: userId,
    type,
    title,
    message,
    metadata: {
      month,
      year,
    },
  });
};

// createRecurringNotificationService
const createRecurringNotificationService = async (
  userId,
  recurringId,
  expenseId,
  scheduledDate,
  title,
  message
) => {
  const notification =
    await findRecurringNotification(
      recurringId,
      expenseId
    );

  if (notification) {
    return;
  }

  return await createNotificationService({
    user: userId,
    type: NOTIFICATION_TYPES.RECURRING_CREATED,
    title,
    message,
    metadata: {
      recurringId,
      expenseId,
      scheduledDate,
    },
  });
};

module.exports = {
    createNotificationService,
    getNotificationsService,
    getUnreadCountService,
    markAsReadService,
    markAllAsReadService,
    deleteNotificationService,
    createBudgetNotificationService,
    createRecurringNotificationService,
};