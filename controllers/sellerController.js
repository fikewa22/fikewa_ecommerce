const Product = require("../models/Product");
const Order = require("../models/Order");
const { validationResult } = require("express-validator");

exports.createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, price, category, stock, imageUrl } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
      createdBy: req.user.id, // Assuming req.user.id contains the seller's ID
    });

    const product = await newProduct.save();

    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, price, category, stock, imageUrl } = req.body;

  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    if (product.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.stock = stock;
    product.imageUrl = imageUrl;

    await product.save();

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    if (product.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await product.remove();

    res.json({ msg: "Product removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user.id }).sort({
      date: -1,
    });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getOrderForSeller = async (req, res) => {
  try {
    const orders = await Order.find({
      "products.product": { $in: req.user.id },
    }).populate("products.product");
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
