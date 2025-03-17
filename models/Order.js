import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  orderStatus: {
    type: String,
    enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
    default: "placed",
  },
  paymentId: { type: String },
  paymentMethod: { type: String },
  paymentDetails: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;
