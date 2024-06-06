const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { registerAdmin, deleteUser } = require("../controllers/userController");
const { registerInitialAdmin } = require("../controllers/adminController");

// Admin registration route (protected)
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  registerAdmin
);

// Temporary route to register the first admin
router.post(
  "/register-initial-admin",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  registerInitialAdmin
);

router.delete("/user/:id", deleteUser);

module.exports = router;
