const mongoose=require("mongoose")

const resisterSchema=new mongoose.Schema({
     username:{
        type:String,
        required:true
     },
     email:{
        type:String,
        required:true,
        unique:true
     },
     password:{
        type:String,
        required:true
     }
},
{
   timestamps:true
}
)

RegisterUser=mongoose.model("user",resisterSchema)

module.exports=RegisterUser