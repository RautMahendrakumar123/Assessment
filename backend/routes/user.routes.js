const express=require('express')
const bcrypt=require("bcrypt")
const jsonwebtoken=require("jsonwebtoken")
const RegisterUser = require('../models/user.register.model')
require('dotenv').config()
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     NewUser:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Username of the new user
 *         email:
 *           type: string
 *           description: Email of the new user
 *         password:
 *           type: string
 *           description: Password of the new user
 * 
 * /signup/user:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     description: Create a new user with the provided username, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/NewUser'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.post('/signup/user',async (req,res)=>{

    // let validatemail= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    // const validatepass=/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

    // if(!validatemail.test(req.body.email)){
    //     return res.json({error:"invalid email"})
    // }
    // if(!validatepass.test(req.body.password)){
    //     return res.json({error:"invalid password"})
    // }
    if(req.body){
        const salt = await bcrypt.genSalt(8)
        const hashedvalue = await bcrypt.hash(req.body.password,salt)
        const data = new RegisterUser({...req.body,password:hashedvalue})
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

/**
 * @swagger
 * components:
 *   schemas:
 *     SignInUser:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: Email of the user trying to sign in
 *         password:
 *           type: string
 *           description: Password of the user trying to sign in
 * 
 * /signin/user:
 *   post:
 *     tags:
 *       - Users
 *     summary: Sign In as an user
 *     description: Sign in as an admin user with the provided credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInUser'
 *     responses:
 *       200:
 *         description: Sign-in successful. Returns a JSON Web Token (JWT) to be used for authentication.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JSON Web Token (JWT) for authentication.
 *       400:
 *         description: Bad Request. Invalid username or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid username or password"
 *       500:
 *         description: Internal Server Error. An error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 * 
 * securityDefinitions:
 *   bearerAuth:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 */

router.post('/signin/user',async (req,res)=>{
    const data = await RegisterUser.findOne({email:req.body.email})
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
    const token = jsonwebtoken.sign({email:data.email,role:data.role},process.env.SECRET_KEY)
    res.status(200).json({token})
})

module.exports=router

