import { Review } from "../models/Review.js";
import { Product } from "../models/Product.js";

exports.createReview = async (req, res) => {
  try {
    const { productId, email, fullName, review, rating } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Create a new review
    const newReview = new Review({ email, fullName, review, rating });
    await newReview.save();

    // Add the review ID to the product
    const product = await Product.findByIdAndUpdate(
      productId,
      { $push: { reviews: newReview._id } },
      { new: true }
    ).populate("reviews");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Recalculate rating and review count
    const totalReviews = product.reviews.length;
    const totalRating = product.reviews.reduce(
      (sum, rev) => sum + rev.rating,
      0
    );
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    // Update product with new rating and review count
    product.reviewsCount = totalReviews;
    product.rating = averageRating.toFixed(1); // Round to 1 decimal place
    await product.save();

    res.status(201).json({
      message: "Review added successfully",
      newReview,
      updatedProduct: {
        rating: product.rating,
        reviewsCount: product.reviewsCount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding review" });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Error fetching reviews" });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: "Error fetching review" });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({ message: "Review updated", updatedReview });
  } catch (error) {
    res.status(500).json({ error: "Error updating review" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting review" });
  }
};
