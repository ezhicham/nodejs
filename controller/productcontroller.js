// import schema  models
const Myproduct = require("../models/productSchema");

// get data from db and display and send it to index page=============
const product_index_get=(req, res) => {
    Myproduct.find()
      .then((result) => {
        res.render("index", { productsArr: result });
      })
      .catch((error) => {
        console.log(error);
      });
  }

// get targeted product from database and send it  to the view page===========
 const oneproduct_view_get= (req, res) => {
    Myproduct.findById(req.params.id)
      .then((result) => {
        console.log(result);
        res.render("product/view", { targetproduct: result });
      })
      .catch((erro) => {
        console.log(erro);
      });
  }


  // get the data that i want to edit on it===========

 const geonetargetpro_edit_get= (req, res) => {
    Myproduct.findById(req.params.id)
      .then((result) => {
        res.render("product/edit", { editProduct: result });
      })
      .catch((err) => {
        console.log(error);
      });
  }

//  delete the product=================
 const delete_product= (req, res) => {
    console.log(req.params.id);
    console.log("=============================");
  
    Myproduct.findByIdAndDelete(req.params.id)
      .then((result) => {
        console.log("products deleted successfully");
        res.redirect("/");
      })
      .catch((error) => {
        console.log("data no deleted ");
      });
  }


//   //  update the data =========
 const update_product= (req, res) => {
    Myproduct.findByIdAndUpdate(req.params.id, req.body)
      .then((result) => {
        res.redirect("/");
      })
      .catch((error) => {
        console.log(error);
      });
  
    console.log(req.params.id);
    console.log("=====================");
  }


//  search prodcuts ================
 const product_search_post= (req, res) => {
    console.log("-------search---------------");
  
    const searchtext = req.body.searchvalue.trim();
  
    Myproduct.find({
      $or: [
        { producttype: { $regex: searchtext, $options: "i" } },
        { period: { $regex: searchtext, $options: "i" } },
      ],
    })
      .then((result) => {
        console.log(result);
        res.render("product/search", { searchedProductarr: result });
      })
      .catch((error) => {
        console.log(error);
      });
  }

// render the  add product page========
 const product_add_get= (req, res) => {
    res.render("product/add");
  }



    //  save the product details and in database ================
 const saveProduct_post= (req, res) => {
    console.log(req.body);
    const product = new Myproduct(req.body);
  
    //  save the product details and in database
    product
      .save()
      .then((result) => {
        console.log("data saved succesfully!!");
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  }


  module.exports={
    product_index_get,
    oneproduct_view_get,
    geonetargetpro_edit_get,
    delete_product,
    update_product,
    product_search_post,
    product_add_get,
    saveProduct_post
}