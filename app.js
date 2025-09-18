const express = require("express");
const app = express();
const port = 3001;
const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static('public'))

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

app.get("/product/view.html", (req, res) => {
  res.render("product/view")
});

app.get("/product/edit.html", (req, res) => {
  res.render("product/edit")
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