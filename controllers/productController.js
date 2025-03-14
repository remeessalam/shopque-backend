import Product from "../models/Product.js";

// add a new product
exports.addProduct = async (req, res) => {
  try {
    console.log("reqis here");
    const product = new Product(req.body);
    await product.save();
    res
      .status(201)
      .json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// get single product by id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: "reviews",
      model: "Review",
      options: { limit: 10 },
    });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// update a product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};
