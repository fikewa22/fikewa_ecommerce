const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.user.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "Authorization denied" });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

exports.authenticateAdmin = async (req, res, next) => {
  exports.authenticateUser(req, res, async () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  });
};

exports.authenticateSeller = async (req, res, next) => {
  exports.authenticateUser(req, res, async () => {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  });
};
