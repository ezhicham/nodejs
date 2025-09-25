const express = require("express");
const app = express();
const port = process.env.PORT  || 3001;
const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: true }));
const methodOverride = require('method-override')
app.set("view engine", "ejs");
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(express.json())
// cookies parser package to get the cookies from the client side ===========
var cookieParser = require('cookie-parser')
app.use(cookieParser()) 


// import all routes  module
const allroutes=require("./routes/allroutes")

// import all routes  module
const addProduct=require("./routes/addProduct")



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
    liveReloadServer.refresh("product/index");
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




// use the routes 
app.use(allroutes)

app.use(addProduct)