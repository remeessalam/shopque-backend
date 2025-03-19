import ReturnRequest from "../models/ReturnProduct.js";
import Order from "../models/Order.js";

// Create Return Request
export const createReturnRequest = async (req, res) => {
  try {
    const { orders, reasonToReturn, methodForReturning, returnPaymentMethod } =
      req.body;

    // Validate all fields
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid orders data" });
    }

    if (
      !reasonToReturn?.question1 ||
      !reasonToReturn?.answer1 ||
      !reasonToReturn?.question2 ||
      !reasonToReturn?.answer2
    ) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid reason to return data" });
    }

    if (!methodForReturning || !returnPaymentMethod) {
      return res.status(400).json({
        status: false,
        message: "Return method details are required",
      });
    }

    const newRequest = new ReturnRequest({
      user: req.user?.userId,
      orders,
      reasonToReturn,
      methodForReturning,
      returnPaymentMethod,
    });

    await newRequest.save();

    // Update order status to 'return'
    for (const order of orders) {
      await Order.findOneAndUpdate(
        { _id: order.orderID },
        { orderStatus: "return" }
      );
    }

    res.status(201).json({
      status: true,
      message:
        "Return request submitted successfully and order status updated to return.",
      data: newRequest,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Get All Return Requests
export const getAllReturnRequests = async (req, res) => {
  try {
    const requests = await ReturnRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
