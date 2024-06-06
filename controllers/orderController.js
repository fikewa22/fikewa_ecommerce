const Order = require("../models/Order");
const Product = require("../models/Product");
const { validationResult } = require("express-validator");

exports.placeOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { products, totalAmount } = req.body;

  try {
    const order = new Order({
      user: req.user.id,
      products,
      totalAmount,
    });

    await order.save();

    res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate(
      "products.product"
    );

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "products.product"
    );

    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.returnOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    order.status = "Returned";
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
