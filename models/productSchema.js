

const mongoose=require("mongoose")

const Schema=mongoose.Schema;
 const productschema = new Schema({
   
    producttype:String,
    period:String,
    email:String,
    password:String,
    status:String,



 })



module.exports = mongoose.model('product', productschema);