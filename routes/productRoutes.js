const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const {
  authenticateUser,
  authenticateAdmin,
} = require("../middleware/authMiddleware");

// Get all products (accessible to all users)
router.get("/", getAllProducts);

// Get product by ID (accessible to all users)
router.get("/:productId", getProductById);

// Protected routes accessible only to admin users
router.post(
  "/",
  authenticateAdmin,
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("description")
      .notEmpty()
      .withMessage("Product description is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Product price must be greater than 0"),
    body("category").notEmpty().withMessage("Product category is required"),
    body("stock")
      .isInt({ gt: -1 })
      .withMessage("Product stock must be a non-negative integer"),
    body("imageUrl").notEmpty().withMessage("Product image URL is required"),
  ],
  createProduct
);

// Update a product (admin only)
router.put(
  "/:productId",
  authenticateAdmin,
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("description")
      .notEmpty()
      .withMessage("Product description is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Product price must be greater than 0"),
    body("category").notEmpty().withMessage("Product category is required"),
    body("stock")
      .isInt({ gt: -1 })
      .withMessage("Product stock must be a non-negative integer"),
    body("imageUrl").notEmpty().withMessage("Product image URL is required"),
  ],
  updateProduct
);

// Delete a product (admin only)
router.delete("/:productId", authenticateAdmin, deleteProduct);

module.exports = router;
