const { ValidationError } = require("joi");
const CustomError = require("../utils/Error");
const errorMiddleware = (err, req, res, next) => {
  console.log("Error Middleware");

  const errorMessage =
    process.env.NODE_ENV === "development"
      ? err.message
      : "Something went wrong!";

  let error = {
    // status: err.status ? err.status : 500,
    message: errorMessage,
    errors: [
      ...err.errors,
      ...(err?.errors?.length == 0 ? ["Server Error!"] : []),
    ],
    hints: err.hints,
    trace_id: req.headers["x-trace-id"],
  };

  // Check if the error is an instance of CustomError
  if (err instanceof CustomError) {
    error = {
      ...error,
    };
  }

  // Check if the error is an instance of ValidationError
  if (err instanceof ValidationError) {
    error = {
      ...error,
      // status: 422,
    };
  }

  res.status(err.status || 500).json(error);
};

module.exports = errorMiddleware;
