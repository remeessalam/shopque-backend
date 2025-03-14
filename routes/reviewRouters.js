import express from "express";
import {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", createReview);
router.get("/", getReviews);
router.get("/reviews/:id", getReviewById);
router.put("/reviews/:id", updateReview);
router.delete("/reviews/:id", deleteReview);

module.exports = router;
