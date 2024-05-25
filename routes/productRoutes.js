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

// Create a new product
router.post(
  "/",
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

// Get product by ID
router.get("/:productId", getProductById);

// Get all products
router.get("/", getAllProducts);

// Update a product
router.put(
  "/:productId",
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

// Delete a product
router.delete("/:productId", deleteProduct);

module.exports = router;
