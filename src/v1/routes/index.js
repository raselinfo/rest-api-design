const router=require("express").Router()
const createProductController=require("../controllers/createProduct.controller")
const getProductController=require("../controllers/getProduct.controller")
const getAllProductsController=require("../controllers/getAllProducts.controller")
const deleteProductController=require("../controllers/deleteProduct.controller")
const updateProductController=require("../controllers/updateProduct.controller")


// Create product
router.post("/products", createProductController);
// Get Product
router.get("/products/:id", getProductController);

// Get all products
router.get("/products", getAllProductsController);

// Update or Create product
router.put("/products/:id", updateProductController);

// Delete a product
router.delete("/products/:id",deleteProductController)

module.exports=router