const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
    totalAfterDiscount: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    appliedCoupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cart", cartSchema);
