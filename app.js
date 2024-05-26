const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const errorHandler = require("./middleware/errorHandlerMiddleware");
const loggingMiddleware = require("./middleware/loggingMiddleware");
// const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(loggingMiddleware);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api", require("./routes/publicRoutes"));

app.use("/api", require("./routes/protectedRoutes"));
// app.use("/api/admin", adminRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Welcome to the Fikewa Node.js Ecommerce Platform!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
