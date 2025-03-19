// models/ReturnRequest.js
import mongoose from "mongoose";
const ReturnRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orders: [
      {
        orderID: { type: String, required: true },
        products: [
          {
            id: { type: String, required: true },
            name: { type: String, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            returnDate: { type: String },
          },
        ],
      },
    ],
    reasonToReturn: {
      question1: { type: String, required: true },
      answer1: { type: String, required: true },
      question2: { type: String, required: true },
      answer2: { type: String, required: true },
    },
    methodForReturning: { type: String, required: true },
    returnPaymentMethod: { type: String, required: true },
  },
  { timestamps: true }
);

const ReturnRequest = mongoose.model("ReturnRequest", ReturnRequestSchema);
export default ReturnRequest;
