const CustomError = require("../utils/Error");
const deleteProductService = require("../services/deleteProductService");
const { trace } = require("joi");

const deleteProductController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if(!id){
      const error = CustomError.badRequest({
        message: "Validation Error",
        errors: ["id is required"],
        hints: "Please provide the id of the product to be deleted",
      });
      return next(error);
    }


    const deleteProduct = await deleteProductService(id);

    res.status(200).json({
      message: "Product Deleted Successfully",
      data: {
        id: deleteProduct.id,
        name: deleteProduct.name,
        sku: deleteProduct.sku,
        links: {
          self: `/products`,
          create: `/products`,
          get: `/products/${deleteProduct.id}`,
        },
      },
      trace_id: req.headers["x-trace-id"],
    });
  } catch (err) {
    const error = CustomError.serverError(err);
    next(error);
  }
};


module.exports = deleteProductController;