const express = require('express')
const postRoute = require('../models/post.model')
const router = express.Router()
const validation = require('../validation/validation')



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


router.get('/product/:id', async (req, res) => {
    try {
        const data = await postRoute.findById(req.params.id)
        res.status(200).json(data)
    } catch (err) {
        res.json({ message: err.message })
    }
})


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
router.delete('/delete/:id',validation,async(req, resp)=>{
    try {
        await postRoute.findByIdAndDelete(req.params.id);
        resp.status(200).json({message:'data deleted succefully'})
    } catch (err) {
        resp.json({message:err.message})
    }
})
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