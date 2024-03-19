const cors = require("cors");
const errorMiddleware = require("../middlewares/error.middleware");
const correlationMiddleware = require("../middlewares/correlationid.middleware");
const productRoutes = require("../routes");
const CustomError = require("../utils/Error");
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Middlewares
app.use(correlationMiddleware);

// Routes
app.use("/api/v1", productRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ message: "🚀 Catalog Service is up and running" });
});

// Not Found Handler
app.use((_req, res) => {
  const error = CustomError.notFound({
    message: "Resource Not Found",
    errors: ["The requested resource does not exist"],
    hints: "Please check the URL and try again",
  });
  res.status(error.status).json(error);
});

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;
