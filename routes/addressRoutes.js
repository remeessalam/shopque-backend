import express from "express";
import {
  createAddress,
  getAllAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createAddress);
router.get("/address", verifyToken, getAllAddress);
router.put("/addresses/:id", verifyToken, updateAddress);
router.delete("/delete-address/:id", verifyToken, deleteAddress);

export default router;
