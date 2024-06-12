const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware");
const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCart,
} = require("../controllers/cartController");

// Get cart
router.get("/", authenticateUser, getCart);

// Add item to cart
router.post("/add", authenticateUser, addToCart);

// Remove item from cart
router.delete("/remove", authenticateUser, removeFromCart);

// Update cart item quantity
router.put("/update", authenticateUser, updateCartItemQuantity);

module.exports = router;
