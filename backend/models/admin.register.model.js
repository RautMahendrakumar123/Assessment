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
     },
     role:{
      type:String,
      default: "admin"
     }
},
{
   timestamps:true
}
)

RegisterAdmin=mongoose.model("admin",resisterSchema)

module.exports=RegisterAdmin