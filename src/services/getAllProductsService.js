const prisma = require("../utils/prisma");

const getAllProductsService = async (settings={}) => {
  
  // Todo: Get all published products from the database
  const products = await prisma.product.findMany(settings);

  return products;
};

module.exports = getAllProductsService;
