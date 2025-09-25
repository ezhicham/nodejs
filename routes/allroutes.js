const express = require("express");
const router = express.Router();

// import packages 
const bcrypt= require("bcrypt")
const jwt=require("jsonwebtoken")

// express validator to valid the form data  {email,password}
const { check, validationResult, cookie } = require("express-validator");
// import schema  models
const Myproduct = require("../models/productSchema");
const usermodel=require("../models/userSchema")
// import functions ========
const productconteller=require("../controller/productcontroller")


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

//  save the credentials of user (register new user) 
router.post("/save-user",
    [
        check("email", "Please provide a valid email").isEmail(),
        check("password", "Password must be at least 8 characters with 1 upper case letter and 1 number").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
     ],
    async(req,res) => { 
    
       
        const objError = validationResult(req);
        console.log(objError.errors);
        
        if (objError.errors.length > 0) {
         return res.json({validateErrors:objError.errors})
        }

    // search about user depends on email ===============
 const isexist= await   usermodel.findOne({email:req.body.email})


   
    // check if the user exist or not  if exist don't register again  if not save the user 
    if(isexist==null){   

    const saveduser=    await    usermodel.create(req.body)
      
      try {

        const token =   jwt.sign({id:saveduser._id} , "zagarov@1209")
               res.cookie("jwt",token ,{httpOnly:true, maxAge:8660000})

         
        console.log(saveduser)
         console.log("user saved successfully")
         return res.json({usersavedSuccessfully:saveduser._id})
      } catch (error) {
        console.log("user note saved ")
        return res.json({saveError:" user not saved check your internet"})
      }

    }else{
        
      return  res.json({userexist:"user already exist please user another email "})
    }




 })



//  login to the account  and save jwt in the cookies 
   router.post("/login",async(req,res) => { 

    //  1# check if email is exist 
    // 2# hash password and compare it with stored password 

       const isEmailExist =await usermodel.findOne({email:req.body.email})
        
        if(isEmailExist==null){
          return res.json({userNotexist:"user not exist please register first "})
          
        }else{
            console.log("email  exist")
          // 2# hash password and compare it with stored password 
          const matches= await bcrypt.compare( req.body.password , isEmailExist.password )


        // 3# check if the hashed passwords are  matches
        if(matches){
        //  console.log("password matches and email exist")
            //  4# save the jwt in the cookies if the credentials is correct 
           const token =   jwt.sign({id:isEmailExist._id} , "zagarov@1209")
              res.cookie("jwt",token ,{httpOnly:true, maxAge:8660000})


           return res.json({useID:isEmailExist._id})

        } else {
            // console.log("passowrd not matches and email exist")
            return  res.json({passwordWrong:"Password wrong please try again "})
        }
          
        }

        //   res.redirect("/login")

 })

// get data from db and display and send it to index page=============
router.get("/index",checkAuthUser, productconteller.product_index_get );



// get targeted product from database and send it  to the view page===========
router.get(`/view/:id` ,checkAuthUser, productconteller.oneproduct_view_get);

// get the data that i want to edit on it===========
router.get("/edit/:id",checkAuthUser,productconteller.geonetargetpro_edit_get);



//  delete the product=================

router.delete("/delete/:id", productconteller.delete_product);



//  update the data ===========
router.put("/update/:id",productconteller.update_product);



//  search prodcuts ================

router.post("/search",productconteller.product_search_post);




// logout  by remove the jwt from cookies  ======

router.get("/logout",(req,res) => { 
 
     res.cookie("jwt", "", { maxAge: 1 });

  res.redirect("/");



 })








module.exports = router;
