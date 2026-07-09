const mongoose = require("mongoose");
const CATEGORY_TYPES = require("../../shared/constants/categoryTypes");

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
  type: String,
  enum: Object.values(CATEGORY_TYPES),
  required: true,
},

    icon: {
      type: String,
      required: true,
      trim: true,
    },

    color: {
      type: String,
      required: true,
      trim: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
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

// Prevent duplicate category names of the same type for a user
categorySchema.index(
  {
    user: 1,
    name: 1,
    type: 1,
  },
  {
    unique: true,
  }
);

const Category = mongoose.model("Category", categorySchema);


module.exports =  Category ;