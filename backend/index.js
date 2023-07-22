const mongoose =require('mongoose')
const express=require('express')
const dotenv=require("dotenv")
const cors=require('cors')
const app=express()
dotenv.config()


app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_DB)
.then(()=>{
    console.log('connect to DB')
})
.catch((err)=>{
    console.log(err)
})


// app.use(require("./Routes/auth"))
// app.use(require('./Routes/uploadVideo'))
app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`)
})