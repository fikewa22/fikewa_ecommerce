// controllers/paymentController.js
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const { validationResult } = require("express-validator");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Initiate a payment
exports.initiatePayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { orderId, paymentMethod } = req.body;

  try {
    const order = await Order.findById(orderId).populate("products.product");

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.totalAmount * 100, // Stripe works with cents
      currency: "usd",
      payment_method_types: [paymentMethod],
      metadata: { orderId: orderId.toString(), userId: req.user.id.toString() },
    });

    const payment = new Payment({
      user: req.user.id,
      order: orderId,
      amount: order.totalAmount,
      paymentMethod,
      stripePaymentIntentId: paymentIntent.id,
    });

    await payment.save();

    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Handle Stripe webhook events
exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (payment) {
      payment.status = "completed";
      await payment.save();

      const order = await Order.findById(payment.order);
      order.status = "confirmed";
      await order.save();
    }
  }

  res.json({ received: true });
};
