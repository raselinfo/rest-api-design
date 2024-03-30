const getAllProductsService = require("../services/getAllProductsService");
const CustomError = require("../../utils/Error");
const queryValidation = require("../../utils/queryValidation");
const getAllProductsController = async (req, res, next) => {
  try {
    const query = req.query;
    const page = +query.page || 1;
    const limit = +query.limit || 10;

    /* This block of code is handling the validation of fields that are requested in the query parameters.
Here's a breakdown of what each part is doing: */
    const allowedFields = ["name", "description", "price", "status", "sku"];
    const { invalidFields, validFields } = queryValidation({
      query,
      allowedFields,
    });

    if (invalidFields?.length) {
      const error = CustomError.badRequest({
        message: "Invalid fields",
        errors: invalidFields,
        hints: `Please provide valid fields from [${allowedFields.join(",")}]`,
      });
      return next(error);
    }

    // Apply filter
    let where = {
      status: "PUBLISHED",
    };
    if (query?.priceMin) {
      where.price = { gte: parseFloat(query?.priceMin) };
    }
    if (query?.priceMax) {
      where.price = { ...where.price, lte: parseFloat(query?.priceMax) };
    }

    // Sort Products
    let orderBy = {};
    if (query?.sort) {
      orderBy[query?.sort] =
        query?.order && query?.order.toLowerCase() === "desc" ? "desc" : "asc";
    }

    const items = await getAllProductsService({ where });
    const totalPage = Math.ceil(items.length / limit);

    let paginatedProducts = await getAllProductsService({
      where,
      ...(Object.keys(validFields).length && { select: validFields }),
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    const products = paginatedProducts.map((product) => {
      return {
        ...product,
        links: {
          self: `/products/${product.id}`,
          "add-to-cart": `/cart/add`,
        },
      };
    });

    // Prepare response
    const response = {
      message: "Product Retrieval Successful",
      info: "The URL '/api/v1/products' has been deprecated and we have now shifted it to '/api/v2/products.' If you want to learn more about this update, please visit our developer portal at http://developer.stackshop.com.",
      data: products,
      pagination: {
        page,
        limit,
        totalPage,
        totalItems: items.length,
        links: {
          self: `/products?page=${page}&limit=${limit}`,
          first: `/products?page=1&limit=${limit}`,
          last: `/products?page=${totalPage}&limit=${limit}`,
          prev: page > 1 ? `/products?page=${page - 1}&limit=${limit}` : null,
          next:
            page < totalPage
              ? `/products?page=${page + 1}&limit=${limit}`
              : null,
        },
      },
    };

    console.log("Call from GET /products");

    // Set Cache-Control header
    res.header("Cache-Control", "public,max-age=60");
    
    res.status(200).json(response);
  } catch (err) {
    const error = CustomError.serverError(err);
    next(error);
  }
};

module.exports = getAllProductsController;
