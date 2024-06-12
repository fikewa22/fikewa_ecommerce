// routes/paymentRoutes.js
const express = require("express");
const { body } = require("express-validator");
const { authenticateUser } = require("../middleware/authMiddleware");
const {
  initiatePayment,
  handleStripeWebhook,
} = require("../controllers/paymentController");

const router = express.Router();

router.post(
  "/initiate",
  authenticateUser,
  [
    body("orderId").notEmpty().withMessage("Order ID is required"),
    body("paymentMethod").notEmpty().withMessage("Payment method is required"),
  ],
  initiatePayment
);

// Stripe webhook endpoint
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

module.exports = router;
