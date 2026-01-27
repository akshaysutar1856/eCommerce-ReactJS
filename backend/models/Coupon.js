const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Percentage", "Fixed Amount"],
    },
    status: {
      type: String,
      required: true,
      default: "Active",
      enum: ["Active", "Expired"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Coupon", couponSchema);
