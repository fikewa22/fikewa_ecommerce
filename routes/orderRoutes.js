const express = require("express");
const { body } = require("express-validator");
const {
  placeOrder,
  getOrderDetails,
  getUserOrders,
} = require("../controllers/orderController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateUser, placeOrder);

router.get("/:orderId", authenticateUser, getOrderDetails);

router.get("/", authenticateUser, getUserOrders);

module.exports = router;
