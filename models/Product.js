import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  images: [String],
  name: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  colors: [{ name: String, value: String }],
  sizes: [{ name: String }],
  price: { type: Number, required: true },
  stock: { type: Boolean, default: true },
  keyFeatures: [String],
  whyChoose: [String],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // Added review IDs
});

module.exports = mongoose.model("Product", productSchema);
