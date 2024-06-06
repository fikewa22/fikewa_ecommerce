const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  registerUser,
  loginUser,
  sendPasswordResetLink,
  resetPassword,
} = require("../controllers/userController");
const {
  getAllProducts,
  getProductById,
} = require("../controllers/productController");

// Register user
router.post(
  "/register",
  [
    body("username", "Username is required").not().isEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  registerUser
);

// Login user
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  loginUser
);

// Send password reset link
router.post(
  "/forgot-password",
  [body("email", "Please include a valid email").isEmail()],
  sendPasswordResetLink
);

// Reset password
router.post(
  "/reset-password/:token",
  [
    body("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  resetPassword
);

// Public product routes
router.get("/products", getAllProducts);
router.get("/products/:productId", getProductById);

module.exports = router;
