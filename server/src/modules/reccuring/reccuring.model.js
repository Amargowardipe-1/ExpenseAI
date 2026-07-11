const mongoose = require("mongoose");
const RECURRING_FREQUENCIES = require("../../shared/constants/recurringFrequencies");
const TRANSACTION_TYPES = require("../../shared/constants/transactionTypes");

const recurringSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    transactionType: {
      type: String,
      enum: Object.values(TRANSACTION_TYPES),
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },

    note: {
      type: String,
      trim: true,
      default: "",
    },

    frequency: {
      type: String,
      enum: Object.values(RECURRING_FREQUENCIES),
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      default: null,
    },

    nextRunDate: {
      type: Date,
      required: true,
    },

    lastRunDate: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const RecurringTransaction = mongoose.model( "RecurringTransaction", recurringSchema );

module.exports= RecurringTransaction;