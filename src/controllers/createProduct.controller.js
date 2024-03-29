const createProductService = require("../services/createProductService");
const CustomError = require("../utils/Error");

const joi = require("joi");

const createProductController = async (req, res, next) => {
  try {
    const schema = joi.object({
      name: joi.string().required(),
      description: joi.string().required(),
      price: joi.number().required(),
      sku: joi.string().required(),
      status: joi.string().optional(),
    });

    const validation = schema.validate(req.body);

    if (validation?.error) {
      console.log(validation.error.details[0].message);
      const error = CustomError.badRequest({
        message: "Validation Error",
        errors: [validation.error.details[0].message],
        hints: "Please provide all the required fields",
      });
      return next(error);
    }

    const product = await createProductService(validation.value);

    res.status(201).json({
      message: "Product Created Successfully",
      data: {
        ...product,
        links: {
          self: `/products`,
          get: `/products/${product.id}`,
          update: `/products/${product.id}`,
          delete: `/products/${product.id}`
        },
      },
      trace_id: req.headers["x-trace-id"],
    });
  } catch (err) {
    const error = CustomError.serverError(err);
    next(error);
  }
};

module.exports = createProductController;
