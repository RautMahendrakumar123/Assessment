const mongoose=require("mongoose")

const productSchema=new mongoose.Schema({
   productImage:{
    type:String,
    required:true
   },
   productName:{
    type:String,
    required:true
   },
   productDescription:{
    type:String,
    required:true
   },
   category:{
      type:String,
      required:true
   },
   productPrice:{
    type:String,
    required:true
   },
   userid: {
    type: String,
  }
   
   
},
{
   timestamps:true
}
)

Product=mongoose.model("productData",productSchema)

module.exports=Product;