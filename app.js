const express = require("express");
const app = express();
const port = 3001;
const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: true }));
const methodOverride = require('method-override')
app.set("view engine", "ejs");
app.use(express.static('public'))
app.use(methodOverride('_method'))




// import schema  models
const Myproduct=require("./models/productSchema")


// Auto refresh
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));
 
 
const connectLivereload = require("connect-livereload");
const { type } = require("os");
app.use(connectLivereload());
 
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});



// conect to the database \
mongoose
  .connect(
    "mongodb+srv://zghariservices_db_user:BaP9kwgdGHafiMYh@cluster0.vuexhvx.mongodb.net/all-data?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });





app.get("/", (req, res) => {
// result ==> array of objects
Myproduct.find().then((result) => { 
  res.render("index", { productsArr:result  });
 }).catch((error) => { 
  console.log(error)
  })





});

app.get("/product/add.html", (req, res) => {
  res.render("product/add")
});


// get targeted product from database and send it  to the view page===========
app.get(`/view/:id`, (req, res) => {

  Myproduct.findById(req.params.id).then((result) => { 

    console.log(result)
    res.render("product/view",{targetproduct:result})
   }).catch((erro) => { 
    console.log(erro)
    })
 

});



// get the data that i want to edit on it 
app.get("/edit/:id", (req, res) => {


   Myproduct.findById(req.params.id).then((result) => { 
         res.render("product/edit",{editProduct:result})
    }).catch((err) => { 
      console.log(error)
     })

  
});






 //  save the product details and in database ================
  app.post("/save-product",(req,res) => { 

     console.log(req.body)
     const  product = new Myproduct(req.body)

    //  save the product details and in database 
    product.save().then((result) => { 
      console.log("data saved succesfully!!")
      res.redirect("/")
      }).catch((err) => { 
        console.log(err)
       })

     

   })


  //  delete the product=======

  app.delete("/delete/:id",(req,res) => { 

    console.log(req.params.id)
    console.log("=============================")

    Myproduct.findByIdAndDelete(req.params.id).then((result) => { 
      console.log("products deleted successfully")
      res.redirect("/")
     }).catch((error) => { 
      console.log("data no deleted ")
      })


   })