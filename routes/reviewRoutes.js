const express = require("express");
const { body } = require("express-validator");
const {
  addReview,
  getReviewsByProduct,
  deleteReview,
} = require("../controllers/reviewController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// Add a review
router.post(
  "/",
  authenticateUser,
  [
    body("productId").notEmpty().withMessage("Product ID is required"),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment").notEmpty().withMessage("Comment is required"),
  ],
  addReview
);

// Get reviews for a product
router.get("/:productId", getReviewsByProduct);

// Delete a review
router.delete("/:productId/:reviewId", authenticateUser, deleteReview);

module.exports = router;
