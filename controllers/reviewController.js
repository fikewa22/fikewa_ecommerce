const User = require("../models/User");
const Product = require("../models/Product");
const { validationResult } = require("express-validator");

exports.addReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { productId, rating, comment } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const newReview = {
      user: req.user.id,
      rating,
      comment,
      createdAt: Date.now(),
    };

    product.reviews.push(newReview);
    product.numberOfReviews = product.reviews.length;
    product.averageRating =
      product.reviews.reduce((sum, review) => sum + review.rating, 0) /
      product.reviews.length;

    await product.save();

    // Add the review to the user's reviews array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { reviews: newReview._id },
    });

    res.status(201).json(newReview);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getReviewsByProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate(
      "reviews.user",
      "username"
    );

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product.reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    if (!productId || !reviewId) {
      return res
        .status(400)
        .json({ msg: "Product ID and Review ID are required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const review = product.reviews.id(reviewId);

    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Remove the review
    product.reviews.pull(reviewId);
    product.numberOfReviews = product.reviews.length;
    product.averageRating =
      product.reviews.reduce((sum, review) => sum + review.rating, 0) /
      product.reviews.length;

    await product.save();

    // Remove the review from the user's reviews array
    await User.findByIdAndUpdate(req.user.id, { $pull: { reviews: reviewId } });

    res.json({ msg: "Review removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
