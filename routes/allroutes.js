const express = require("express");
const router = express.Router();



// import schema  models
const Myproduct = require("../models/productSchema");

// import functions ========
const productconteller=require("../controller/productcontroller")

// get data from db and display and send it to index page=============
router.get("/", productconteller.product_index_get );



// get targeted product from database and send it  to the view page===========
router.get(`/view/:id` , productconteller.oneproduct_view_get);

// get the data that i want to edit on it===========
router.get("/edit/:id",productconteller.geonetargetpro_edit_get);



//  delete the product=================

router.delete("/delete/:id", productconteller.delete_product);



//  update the data ===========
router.put("/update/:id",productconteller.update_product);



//  search prodcuts ================

router.post("/search",productconteller.product_search_post);

module.exports = router;
