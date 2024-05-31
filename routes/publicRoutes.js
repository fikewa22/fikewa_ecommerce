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

// Public user registration and login
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  registerUser
);

router.post("/login", loginUser);

// Password reset
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Valid email is required")],
  sendPasswordResetLink
);

router.post(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  resetPassword
);

// Public product routes
router.get("/products", getAllProducts);
router.get("/products/:productId", getProductById);

module.exports = router;
