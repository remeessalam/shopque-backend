import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import serverless from "serverless-http";

import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import wishlistRoutes from "./routes/wishlistRouter.js";
import reviewRouters from "./routes/reviewRouters.js";
import orderRoutes from "./routes/orderRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Shopque backend is running on port 8080");
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRouters);
app.use("/api/orders", orderRoutes);

// Error Handling Middleware
app.use(errorHandler);

// MongoDB Connection
const PORT = process.env.PORT || 8080;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    console.log("MongoDB connected");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// app.use(serverless(app)); // Ensure this is the last middleware

export default app;
export const handler = serverless(app);
