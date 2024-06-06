const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["buyer", "seller", "admin"], default: "buyer" },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],

  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

module.exports = mongoose.model("User", UserSchema);
