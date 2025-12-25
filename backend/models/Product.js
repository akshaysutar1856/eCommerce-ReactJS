const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String },
    brand: { type: String },
    category: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    isTrending: { type: Boolean, default: false },
    tag: { type: String }, // e.g., "New", "Sale", "Trending"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
