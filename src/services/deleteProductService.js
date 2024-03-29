const CustomError = require("../utils/Error");
const prisma = require("../utils/prisma");

const deleteProductService = async (id) => {
  try {
    return await prisma.product.delete({
      where: {
        id,
      },
    });
  } catch (err) {
    CustomError.throwError({
      statue: 500,
      message: "The product is not deleted",
      errors: ["Product delete failed"],
      hints: "Maybe the product id is not correct. Please check the product id and try again",

    });

  }
};

module.exports = deleteProductService;
