const router=require("express").Router()
const createProductController=require("../controllers/createProduct.controller")
const getProductController=require("../controllers/getProduct.controller")
const getAllProductsController=require("../controllers/getAllProducts.controller")
// Create product
router.post("/products", createProductController);
// Get Product
router.get("/products/:id", getProductController);

// Get all products
router.get("/products", getAllProductsController);

module.exports=router