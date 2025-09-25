const express=require("express")
const router=express.Router();

// import  product schema  from  models
const Myproduct = require("../models/productSchema");

// import functions ========
const productconteller=require("../controller/productcontroller")

const checkAuthUser=require("../middleware/checkauthuser")

// render the  add product page========
router.get("/product/add.html",checkAuthUser ,productconteller.product_add_get);




  //  save the product details and in database ================
  router.post("/save-product",productconteller.saveProduct_post );


 module.exports = router;