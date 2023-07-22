const express=require('express')
const bcrypt=require("bcrypt")
const jsonwebtoken=require("jsonwebtoken")
const RegisterAdmin = require('../models/admin.register.model')
require('dotenv').config()

const router = express.Router()

router.post('/signup/admin',async (req,res)=>{

    let validatemail= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const validatepass=/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

    if(!validatemail.test(req.body.email)){
        return res.json({error:"invalid email"})
    }
    if(!validatepass.test(req.body.password)){
        return res.json({error:"invalid password"})
    }
    if(req.body){
        const salt = await bcrypt.genSalt(8)
        const hashedvalue = await bcrypt.hash(req.body.password,salt)
        const data = new RegisterAdmin({...req.body,password:hashedvalue})
        await data.save()
        res.status(200).json({
            message:"data saved successfully",
            data:data
        })
    }else{
        res.status(400).json({
            error:"Please enter all the fields"
        })
    }
})

router.post('/signin/admin',async (req,res)=>{
    const data = await RegisterAdmin.findOne({email:req.body.email})
    if(!data){
       return res.status(400).json({
            error:"invalid username or password"
        })
    }
    const comparepassword = await bcrypt.compare(req.body.password,data.password)
    if(!comparepassword){
       return res.status(400).json({
            error:"invalid username or password"
        })
    }
    const token = jsonwebtoken.sign({email:data.email},process.env.SECRET_KEY)
    res.status(200).json({token})
})

module.exports=router
