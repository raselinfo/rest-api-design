const formatError = (err) => {
  const error = {
    message: err?.message ? err.message : err.toString(),
    errors: err.errors || [],
    hints: err.hints
      ? `${err.hints}. If the problem is not resolved, please feel free to contact our technical team with the trace_id`
      : "Please Create a support ticket with the trace_id for further assistance. or contact our technical team with the trace_id",
  };

  return error;
};

class CustomError {
  static notFound(error) {
    const err = formatError(error);
    return {
      status: 404,
      ...err,
    };
  }

  static unauthorized(error) {
    const err = formatError(error);
    return {
      status: 401,
      ...err,
    };
  }

  static badRequest(error) {
    const err = formatError(error);
    return {
      status: 400,
      ...err,
    };
  }

  static serverError(error) {
    const err = formatError(error);
    return {
      status: 500,
      ...err,
    };
  }

  static throwError(error) {
    const err = new Error(error.message);
    err.status = error.status;
    err.errors = error.errors;
    err.hints = error.hints;

    throw err;
  }
}
module.exports = CustomError;
