const mongoose =require('mongoose')
const express=require('express')
const dotenv=require("dotenv")
const cors=require('cors')
const app=express()
dotenv.config()
const bodyParser = require('body-parser');


app.use(express.json())
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_DB)
.then(()=>{
    console.log('connect to DB')
})
.catch((err)=>{
    console.log(err)
})

app.use(require("./routes/user.routes"))
app.use(require('./routes/admin.routes'))

app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`)
})