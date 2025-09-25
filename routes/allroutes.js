const express = require("express");
const router = express.Router();

// import packages 
const bcrypt= require("bcrypt")
const jwt=require("jsonwebtoken")

// express validator to valid the form data  {email,password}
const { check, validationResult, cookie } = require("express-validator");
// import schema  models

const usermodel=require("../models/userSchema")
// import functions ========
const productcontroller=require("../controller/productcontroller")
const authContronller=require("../controller/authContronller")

const checkAuthUser=require("../middleware/checkauthuser")
  

// check if the user exist or not depend on the cookies and send the user details to client sid pages ===================
const checkifuser =  (req,res,next) => { 

       const token=req.cookies.jwt
       console.log(token)
        if(token){

            jwt.verify(token, "zagarov@1209" , async (error,decoded) => { 
                if(error){
                  res.locals.userdetails=null;
                  next()
                }else{
                     const currentUser=await usermodel.findById(decoded.id).select("-password")
                     console.log(currentUser)
                     res.locals.userdetails=currentUser;
                     next()
                }
             })

            console.log("token existed")
        }else{

            console.log("token unexisted")
            res.locals.userdetails=null;
            next()
        }


  

 }


//  send the data to client pages
 router.get("*",checkifuser)




// display welcome page

router.get("/",(req,res) => { 

    res.render("welcome",{})
 })


//  /   display the login page
 router.get("/login", (req,res) => { 

    res.render("authpage/login",{})
 })
//   display the register page
router.get("/register",(req,res) => { 

    res.render("authpage/register",{})
 })

//  save the credentials of user (register new user) and check the email and password 
router.post("/save-user",
    [
        check("email", "Please provide a valid email").isEmail(),
        check("password", "Password must be at least 8 characters with 1 upper case letter and 1 number").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
     ],

     authContronller.register_post
  )



//  login to the account  and save jwt in the cookies 
   router.post("/login",authContronller.login_post_verify )

// get data from db and display and send it to index page=============
router.get("/index",checkAuthUser, productcontroller.product_index_get );



// get targeted product from database and send it  to the view page===========
router.get(`/view/:id` ,checkAuthUser, productcontroller.oneproduct_view_get);

// get the data that i want to edit on it===========
router.get("/edit/:id",checkAuthUser, productcontroller.geonetargetpro_edit_get);



//  delete the product=================

router.delete("/delete/:id", productcontroller.delete_product);



//  update the data ===========
router.put("/update/:id",productcontroller.update_product);



//  search prodcuts ================

router.post("/search",productcontroller.product_search_post);




// logout  by remove the jwt from cookies  ======

router.get("/logout",(req,res) => { 
 
     res.cookie("jwt", "", { maxAge: 1 });

  res.redirect("/");



 })








module.exports = router;
