import express from "express";
import {
  createReturnRequest,
  getAllReturnRequests,
} from "../controllers/productReturnController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createReturnRequest);
router.get("/", verifyToken, getAllReturnRequests);

export default router;
