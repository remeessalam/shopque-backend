import express from "express";
import crypto from "crypto";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a new order
router.post("/create-order", async (req, res) => {
  try {
    const { products, totalAmount, shippingAddress, paymentMethod } = req.body;
    const { userId } = req.user;

    if (!products || !totalAmount || !shippingAddress) {
      return res.status(400).json({
        status: false,
        message: "Products, total amount, and shipping address are required",
      });
    }

    const newOrder = new Order({
      user: userId,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: "pending",
    });

    const savedOrder = await newOrder.save();
    await User.findByIdAndUpdate(userId, { $push: { orders: savedOrder._id } });

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: savedOrder._id.toString(),
    });

    res.status(201).json({
      status: true,
      message: "Order created successfully",
      data: { ...savedOrder.toObject(), razorpayOrder },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ status: false, message: "Failed to create order" });
  }
});

// Verify Razorpay payment
router.post("/verify-payment", async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        status: false,
        message: "Order ID, payment ID, and signature are required",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (expectedSignature === signature) {
      order.paymentStatus = "paid";
      order.paymentId = paymentId;
      order.paymentDetails = req.body;
      await order.save();

      return res.status(200).json({
        status: true,
        message: "Payment verified successfully",
        data: order,
      });
    } else {
      order.paymentStatus = "failed";
      await order.save();

      return res
        .status(400)
        .json({ status: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res
      .status(500)
      .json({ status: false, message: "Failed to verify payment" });
  }
});

// Get user orders
router.get("/user-orders", async (req, res) => {
  try {
    const { userId } = req.user;
    const orders = await Order.find({ user: userId })
      .populate("products.product")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json({
        status: true,
        message: "Orders fetched successfully",
        data: orders,
      });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ status: false, message: "Failed to fetch orders" });
  }
});

// Get order by ID
router.get("/order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;
    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate("products.product")
      .populate("shippingAddress");

    if (!order) {
      return res
        .status(404)
        .json({ status: false, message: "Order not found" });
    }

    res
      .status(200)
      .json({
        status: true,
        message: "Order details fetched successfully",
        data: order,
      });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res
      .status(500)
      .json({ status: false, message: "Failed to fetch order details" });
  }
});

export default router;
