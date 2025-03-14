import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    fullName: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
