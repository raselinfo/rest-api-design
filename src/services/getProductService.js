const prisma = require("../utils/prisma");

const getProductService = async (id) => {
  const product = await prisma.product.findFirst({
    where: {
      id,
      status: "PUBLISHED",
    },
  });

  return product;
};

module.exports = getProductService;
