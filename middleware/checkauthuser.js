// check jwt in the cookies and setup middelware =============
const jwt=require("jsonwebtoken")

const checkAuthUser= (req,res,next) => { 
    const token= req.cookies.jwt

    if(token){
          jwt.verify(token , "zagarov@1209" ,(error) => { 

            if(error){
                res.redirect("/login")
            }else{
                
                next()
            }
           })
    }else{
        res.redirect("/login")
    }
    // console.log(token)
    // console.log("=========")
   
 }
module.exports=checkAuthUser