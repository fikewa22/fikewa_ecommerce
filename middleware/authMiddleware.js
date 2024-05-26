const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

exports.authenticateAdmin = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    // Check if the user is an admin
    const user = await User.findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin resources access denied" });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
