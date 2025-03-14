import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts); // Get all products
router.post("/add", addProduct); // Add product
router.get("/:id", getProductById); // Get a single product by ID
router.put("/:id", updateProduct); // Update product
router.delete("/:id", deleteProduct); // Delete product

module.exports = router;
