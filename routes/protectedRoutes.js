const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authenticateAdmin,
  authenticateSeller,
} = require("../middleware/authMiddleware");

// User routes that require authentication
router.use("/users", authenticateUser, require("./userRoutes"));
router.use("/orders", authenticateUser, require("./orderRoutes"));

// Seller routes that require seller authentication
router.use("/seller", authenticateSeller, require("./sellerRoutes"));

// Admin routes that require admin authentication
router.use("/admin", authenticateAdmin, require("./adminRoutes"));
router.use("/products", authenticateAdmin, require("./productRoutes"));

//Review routes
router.use("/reviews", require("./reviewRoutes"));

module.exports = router;
