const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  placeOrder,
  getOrderDetails,
  getUserOrders,
} = require("../controllers/orderController");

// Place a new order
router.post(
  "/",
  [
    body("products")
      .isArray({ min: 1 })
      .withMessage("Products array is required"),
  ],
  placeOrder
);

// Get order details by order ID
router.get("/:orderId", getOrderDetails);

// Get all orders for the logged-in user
router.get("/", getUserOrders);

module.exports = router;
