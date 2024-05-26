const Order = require("../models/Order");
const Product = require("../models/Product");
const { validationResult } = require("express-validator");

exports.placeOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { products } = req.body;

  try {
    let totalAmount = 0;
    const productDetails = [];

    for (const item of products) {
      const product = await Product.findOne({ name: item.productName });
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product with name ${item.productName} not found` });
      }

      totalAmount += product.price * item.quantity;
      productDetails.push({ product: product._id, quantity: item.quantity });
    }

    const order = new Order({
      user: req.user.id,
      products: productDetails,
      totalAmount,
    });

    await order.save();

    res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("user", "username email")
      .populate("products.product", "name price");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "products.product",
      "name price"
    );
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
