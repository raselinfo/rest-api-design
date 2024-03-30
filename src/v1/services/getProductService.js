const prisma = require("../../utils/prisma");

const getProductService = async (id) => {
  const product = await prisma.product.findFirst({
    where: {
      id,
    },
  });

  return product;
};

module.exports = getProductService;
