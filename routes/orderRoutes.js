const express = require("express");
const { body } = require("express-validator");
const {
  placeOrder,
  getOrderDetails,
  getUserOrders,
} = require("../controllers/orderController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  [
    body("products").isArray().withMessage("Products should be an array"),
    body("products.*.productName")
      .notEmpty()
      .withMessage("Product name is required"),
    body("products.*.quantity")
      .isInt({ gt: 0 })
      .withMessage("Quantity must be a positive integer"),
  ],
  placeOrder
);

router.get("/:orderId", authenticateUser, getOrderDetails);

router.get("/", authenticateUser, getUserOrders);

module.exports = router;
