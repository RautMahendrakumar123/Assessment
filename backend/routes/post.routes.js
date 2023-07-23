const express = require('express')
const postRoute = require('../models/post.model')
const router = express.Router()
const validation = require('../validation/validation')
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');



/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Insert data into the database
 *     description: Insert data into the database from the request body.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductData'
 *     responses:
 *       200:
 *         description: Data saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductData'
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the reason for the bad request.
 * components:
 *   schemas:
 *     ProductData:
 *       type: object
 *       properties:
 *         productImage:
 *           type: string
 *           description: The image of the product.
 *         productName:
 *           type: string
 *           description: The name of the product.
 *         productDescription:
 *           type: string
 *           description: The description of the product.
 *         category:
 *           type: string
 *           description: The category of the product.
 *         productPrice:
 *           type: string
 *           description: The price of the product.
 *         userid:
 *           type: string
 *           description: The ID of the user who inserted the data.
 *       required:
 *         - productImage
 *         - productName
 *         - productDescription
 *         - category
 *         - productPrice
 * securityDefinitions:
 *   bearerAuth:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 */

router.post("/upload", validation, async (req, res) => {
    // console.log(req.body)

    try {
        console.log(req.userid)
        const data = await new postRoute({ ...req.body, userid: req.userid })
        await data.save()
        res.status(200).json({
            status: "saved successfully", data: data
        })
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
})

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: Fetch a product from the database by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the product to fetch.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful response with the product data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the product.
 *                 name:
 *                   type: string
 *                   description: The name of the product.
 *                 price:
 *                   type: number
 *                   description: The price of the product.
 *                 description:
 *                   type: string
 *                   description: The description of the product.
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the product was not found.
 */

router.get('/product/:id', async (req, res) => {
    try {
        const data = await postRoute.findById(req.params.id)
        res.status(200).json(data)
    } catch (err) {
        res.json({ message: err.message })
    }
})

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products from the database
 *     description: Fetch all products from the database.
 *     responses:
 *       200:
 *         description: Successful response with product data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the product.
 *                   name:
 *                     type: string
 *                     description: The name of the product.
 *                   price:
 *                     type: number
 *                     description: The price of the product.
 *                   description:
 *                     type: string
 *                     description: The description of the product.
 */

router.get('/product', async (req, res) => {
    try {
        const { productName, category, page, limit } = req.query;
        const object = {};

        if (productName) {
            object.productName = productName;
        }
        if (category) {
            object.category = category;
        }

        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit); 

        const skip = (parsedPage - 1) * parsedLimit;
        const data = await postRoute.find(object).skip(skip).limit(parsedLimit);

        if (data.length === 0) {
            res.status(404).json({ message: "No items found" });
        } else {
            res.status(200).json(data);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete data from the database
 *     description: Delete data from the database for a product with the specified ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the product to delete.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Data deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating that the data was deleted.
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the product was not found.
 * components:
 *   schemas: {}
 * securityDefinitions:
 *   bearerAuth:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 */

router.delete('/delete/:id',validation,async(req, resp)=>{
    try {
        await postRoute.findByIdAndDelete(req.params.id);
        resp.status(200).json({message:'data deleted succefully'})
    } catch (err) {
        resp.json({message:err.message})
    }
})

/**
 * @swagger
 * /update/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update data in the database
 *     description: Update data in the database for a product with the specified ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the product to update.
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdateData'
 *     responses:
 *       200:
 *         description: Data updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating that the data was updated.
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the reason for the bad request.
 * components:
 *   schemas:
 *     ProductUpdateData:
 *       type: object
 *       properties:
 *         productImage:
 *           type: string
 *           description: The updated image of the product.
 *         productName:
 *           type: string
 *           description: The updated name of the product.
 *         productDescription:
 *           type: string
 *           description: The updated description of the product.
 *         category:
 *           type: string
 *           description: The updated category of the product.
 *         productPrice:
 *           type: string
 *           description: The updated price of the product.
 *       required:
 *         - productImage
 *         - productName
 *         - productDescription
 *         - category
 *         - productPrice
 * securityDefinitions:
 *   bearerAuth:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 */

router.put('/update/:id',validation, async (req,res)=>{
    try {
        updateData = req.body
        await postRoute.findByIdAndUpdate(req.params.id,updateData, { new: true });
        res.status(200).json({message:'data updated succefully'})
    } catch (err) {
        res.json({message:err.message})
    }
})



module.exports = router