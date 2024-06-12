const Product = require("../models/Product");
const { validationResult } = require("express-validator");
const User = require("../models/User");

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
      createdBy: req.user.id,
    });

    const product = await newProduct.save();

    // Add the product to the user's products array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { products: product._id },
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ date: -1 });
    res.json(products);
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
