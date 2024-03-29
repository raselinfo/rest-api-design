const setCorrelationId = (req, res, next) => {
  const key = "x-trace-id";
  const correlationId = req.headers[key] || Date.now().toString();
  // set req headers
  req.headers[key] = correlationId;

  next();
};

module.exports = setCorrelationId;
