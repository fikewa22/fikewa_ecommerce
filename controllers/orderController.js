const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const User = require("../models/User");
const { validationResult } = require("express-validator");

exports.placeOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "products.product"
    );
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const products = cart.products.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    const totalAmount = cart.products.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    const order = new Order({
      user: req.user.id,
      products,
      totalAmount,
    });

    // Save the order
    await order.save();

    // Add the order to the user's orders array
    await User.findByIdAndUpdate(req.user.id, { $push: { orders: order._id } });

    // Update the stock of each product
    for (const item of cart.products) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    // Clear the cart after placing the order
    await Cart.findOneAndDelete({ user: req.user.id });

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
