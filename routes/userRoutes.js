const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  sendPasswordResetLink,
  resetPassword,
} = require("../controllers/userController");

router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.post("/forgot-password", sendPasswordResetLink);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
