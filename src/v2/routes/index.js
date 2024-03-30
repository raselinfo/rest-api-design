const router = require("express").Router();
const generateEtag = require("../../utils/generateEtag");
const getAllProductsController = require("../controllers/getAllProducts.controller");

// Get all products
router.get("/products", getAllProductsController);

module.exports = router;
