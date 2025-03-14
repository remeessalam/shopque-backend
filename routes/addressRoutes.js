import express from "express";
import {
  createAddress,
  getAllAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";

const router = express.Router();

router.post("/", createAddress);
router.post("/addresses/:userId", getAllAddress);
router.post("/addresses/:id", updateAddress);
router.post("/addresses/:id", deleteAddress);

export default router;
