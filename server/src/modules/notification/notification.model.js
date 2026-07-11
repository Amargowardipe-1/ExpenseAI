const mongoose = require("mongoose");

const NOTIFICATION_TYPES = require("../../shared/constants/notificationTypes");

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            enum: Object.values(NOTIFICATION_TYPES),
            required: true,
        },

        isRead: {
            type: Boolean,
            default: false,
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

notificationSchema.index({
  user: 1,
  type: 1,
  "metadata.month": 1,
  "metadata.year": 1,
});

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);