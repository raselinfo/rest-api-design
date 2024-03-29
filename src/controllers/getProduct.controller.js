const getProductService = require("../services/getProductService");
const CustomError = require("../utils/Error");
const generateEtag = require("../utils/generateEtag");
const etag = require("etag");

const getProductController = async (req, res, next) => {
  try {
    const { id } = req.params;

    /* This block of code is handling the validation of fields that are requested in the query parameters.
Here's a breakdown of what each part is doing: */
    const query = req.query;
    const fields = query?.fields?.split(",");
    const allowedFields = ["name", "description", "price", "status", "sku"];
    const invalidFields = fields?.reduce((acc, field) => {
      if (!allowedFields.includes(field)) {
        acc.push(`'${field}' is not a valid field`);
      }
      return acc;
    }, []);

    if (invalidFields?.length) {
      const error = CustomError.badRequest({
        message: "Invalid fields",
        errors: invalidFields,
        hints: `Please provide valid fields from [${allowedFields.join(",")}]`,
      });
      return next(error);
    }

    let product = await getProductService(id);

    if (!product) {
      const error = CustomError.notFound({
        message: "Product not found",
        errors: ["The product with the provided id does not exist"],
        hints: "Please provide a valid product id",
      });
      return next(error);
    }

    // This block of code is filtering the product object based on the fields requested in the query parameters.
    if (fields) {
      const filteredProduct = fields.reduce(
        (acc, field) => {
          acc[field] = product[field];
          return acc;
        },
        { id: product.id }
      );
      product = filteredProduct;
    }

    // const lastModified = new Date();
    // Generate ETag
    // Add Cache Control
    // const ETag = generateEtag(product, lastModified);
    const ETag = generateEtag(product)

     console.log("match",req.headers["if-non-match"]);

    if (req.headers["if-none-match"] === ETag) {
      console.log("match", ETag, req.headers["if-non-match"]);
      res.status(304).send("Not Modified");
      return;
    }
    // Add Cache Control
    // res.setHeader("Cache-Control", "public,max-age=60");
    res.setHeader("Etag", ETag);

    console.log(`call from /products${id}`);

    // Prepare response
    res.status(200).json({
      message: "Product Retrieval Successful",
      data: {
        ...product,
        links: {
          self: `/products/${product.id}`,
          "add-to-cart": `/cart/add`,
        },
      },
      trace_id: req.headers["x-trace-id"],
    });
  } catch (err) {
    const error = CustomError.serverError(err);
    next(error);
  }
};

module.exports = getProductController;
