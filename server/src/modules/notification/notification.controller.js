const HTTP_STATUS = require("../../shared/constants/httpStatus");
const ApiResponse = require("../../shared/utils/ApiResponse");

const {
  getNotificationsService,
  getUnreadCountService,
  markAsReadService,
  markAllAsReadService,
  deleteNotificationService,
} = require("./notification.service");

const getNotifications = async (
  req,
  res,
  next
) => {
  try {
    const { page, limit } = req.query;

    const notifications =
      await getNotificationsService(
        req.user._id,
        page,
        limit
      );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Notifications fetched successfully.",
        notifications
      )
    );
  } catch (error) {
    next(error);
  }
};

const getUnreadCount = async (
  req,
  res,
  next
) => {
  try {
    const unreadCount =
      await getUnreadCountService(
        req.user._id
      );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Unread notification count fetched successfully.",
        {
          unreadCount,
        }
      )
    );
  } catch (error) {
    next(error);
  }
};


const markAsRead = async (
  req,
  res,
  next
) => {
  try {
    const notification =
      await markAsReadService(
        req.params.id,
        req.user._id
      );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Notification marked as read.",
        notification
      )
    );
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (
  req,
  res,
  next
) => {
  try {
    await markAllAsReadService(
      req.user._id
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "All notifications marked as read."
      )
    );
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (
  req,
  res,
  next
) => {
  try {
    await deleteNotificationService(
      req.params.id,
      req.user._id
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        "Notification deleted successfully."
      )
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};