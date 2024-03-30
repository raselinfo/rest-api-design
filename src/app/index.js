const cors = require("cors");
const errorMiddleware = require("../middlewares/error.middleware");
const correlationMiddleware = require("../middlewares/correlationid.middleware");
const productRoutesV1 = require("../v1/routes");
const productRoutesV2 = require("../v2/routes");
const CustomError = require("../utils/Error");
const express = require("express");
const app = express();

app.use(
  cors({
    origin: ["http://127.0.0.1:5500"],
    credentials: true,
    // Allow all the headers
    exposedHeaders: ["x-trace-id", "x-correlation-id", "ETag", "if-non-match"],
    // Allow all the methods
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Middlewares
app.use(correlationMiddleware);

// Routes
app.use("/api/v1", productRoutesV1);
app.use("/api/v2", productRoutesV2);

app.get("/health", (_req, res) => {
  res.status(200).json({ message: "🚀 Catalog Service is up and running" });
});

// Not Found Handler
app.use((req, res) => {

  const error = CustomError.notFound({
    message: "Resource Not Found",
    errors: ["The requested resource does not exist"],
    hints: "Please check the URL and try again",
  });
  res
    .status(error.status)
    .json({ ...error, status: undefined,trace_id: req.headers["x-trace-id"] });
});

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;
