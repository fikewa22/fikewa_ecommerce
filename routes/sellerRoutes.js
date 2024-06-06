const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getOrderForSeller,
} = require("../controllers/sellerController");
const { authenticateSeller } = require("../middleware/authMiddleware");

// Create a product (seller only)
router.post(
  "/products",
  authenticateSeller,
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

// Update a product (seller only)
router.put(
  "/products/:productId",
  authenticateSeller,
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

// Delete a product (seller only)
router.delete("/products/:productId", authenticateSeller, deleteProduct);

// Get products for a seller
router.get("/products", authenticateSeller, getSellerProducts);

// Get orders for a seller
router.get("/orders", authenticateSeller, getOrderForSeller);

module.exports = router;
