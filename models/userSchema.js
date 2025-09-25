const mongoose=require("mongoose")
const Schema=mongoose.Schema;
 const bcrypt= require("bcrypt")


const userSchema = new Schema({
  username:String,
  email: String,  
  password:String
    
});

userSchema.pre("save" , async function(next){
 const salt= await bcrypt.genSalt()


 this.password= await bcrypt.hash(this.password ,salt)


  next()
})
 

const usermodel= mongoose.model('User', userSchema);

 module.exports = usermodel 