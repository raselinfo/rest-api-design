const prisma = require("../../utils/prisma");
const CustomError = require("../../utils/Error");
const createProductService = async ({
  name,
  price,
  description,
  status,
  sku,
}) => {
  try{
    const createdProduct = await prisma.product.create({
    data: {
      sku,
      name,
      price,
      description,
      status: status || "DRAFT",
    },
  });

  return createdProduct;
  }catch(err){
    CustomError.throwError({
      message: "Product creation failed",
      status: 500,
      errors: ["Error creating product"],
      hints: "Maybe product already exists with the same SKU. Please use a different SKU",
    })
  }
};

module.exports = createProductService;
