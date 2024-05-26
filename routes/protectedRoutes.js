const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authenticateAdmin,
} = require("../middleware/authMiddleware");

// User routes that require authentication
router.use("/users", authenticateUser, require("./userRoutes"));
router.use("/orders", authenticateUser, require("./orderRoutes"));

// Admin routes that require admin authentication
router.use("/admin", authenticateAdmin, require("./adminRoutes"));
router.use("/products", authenticateAdmin, require("./productRoutes"));

module.exports = router;
