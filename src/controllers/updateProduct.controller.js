const joi = require("joi");
const CustomError = require("../utils/Error");
const createProductService = require("../services/createProductService");
const updateProductService = require("../services/updateProductService");

const updateProductController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product_id = id.trim();

    // If product_id is not provided, then create a new product
    if (!product_id) {
      console.log("Product ID is not provided, creating a new product");

      const schema = joi.object({
        name: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required(),
        sku: joi.string().required(),
        status: joi.string().optional(),
      });
      const validation = schema.validate(req.body);

      if (validation?.error) {
        const error = CustomError.badRequest({
          message: "Validation Error",
          errors: [validation.error.details[0].message],
          hints: "Please provide all the required fields",
        });
        return next(error);
      }

      const product = await createProductService(validation.value);
      return res.status(201).json({
        message: "Product Created Successfully",
        data: {
          ...product,
          links: {
            self: `/products`,
            get: `/products/${product.id}`,
            update: `/products/${product.id}`,
            delete: `/products/${product.id}`,
          },
        },
        trace_id: req.headers["x-trace-id"],
      });
    }

    // If product_id is provided, then update the product
    console.log("Update product")

    // Product validation check
    const schema = joi.object({
      id: joi.string().required(),
      name: joi.string().optional(),
      description: joi.string().optional(),
      price: joi.number().optional(),

      status: joi.string().optional(),
    });

    const validation = schema.validate({ ...req.body, id: product_id });

    if (validation?.error) {
      const error = CustomError.badRequest({
        message: "Validation Error",
        errors: [validation.error.details[0].message],
        hints: "Please provide all the required fields",
      });
      return next(error);
    }
    const updatedProduct = await updateProductService(id, validation.value);

    return res.status(200).json({
      message: "Product Updated Successfully",
      data: {
        ...updatedProduct,
        links: {
          self: `/products/${updatedProduct.id}`,
          get: `/products/${updatedProduct.id}`,
          update: `/products/${updatedProduct.id}`,
          delete: `/products/${updatedProduct.id}`,
        },
      },
      trace_id: req.headers["x-trace-id"],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateProductController;
