const prisma = require("../utils/prisma");
const CustomError = require("../utils/Error");
const updateProductService = async (id, product) => {
  try {
console.log(id, product)
    const updatedProduct = await prisma.product.update({
      where: {
        id: id,
      },
      data: product,
    });

    console.log(updatedProduct)
    return updatedProduct;
  } catch (err) {
    console.log(err.message)
    CustomError.throwError({
      message: "Product update failed",
      status: 500,
      errors: ["Error updating product"],
      hints: "Maybe product does not exist with the given ID or the provided attributes are not valid. Please provide valid attributes and try again.",
    });
  }
};

module.exports = updateProductService;
