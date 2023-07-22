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

RegisterAdmin=mongoose.model("admin",resisterSchema)

module.exports=RegisterAdmin