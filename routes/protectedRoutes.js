const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware");

router.use(authenticateUser);

router.use("/users", require("./userRoutes"));
router.use("/products", require("./productRoutes"));
router.use("/orders", require("./orderRoutes"));

module.exports = router;
