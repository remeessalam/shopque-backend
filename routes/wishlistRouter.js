const express = require("express");
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

router.get("/", getWishlist);

router.post("/add", addToWishlist);

router.delete("/remove/:productId", removeFromWishlist);

module.exports = router;
