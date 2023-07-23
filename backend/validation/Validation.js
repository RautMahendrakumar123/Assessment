const jsonwebtoken=require("jsonwebtoken")
const dotenv=require("dotenv")
dotenv.config()
module.exports = (req, res, next)=>{
    // console.log(req.headers);
    if (!req.headers.authorization) {
        return res.status(401).json({
            message:'You Must Be Logged In First'
        })
    }
    let token = req.headers.authorization.split(' ')[1]
    jsonwebtoken.verify(token, process.env.SECRET_KEY, (err, payload)=>{
        if (err) {
           return res.status(403).json({
                message:'You Must Be Logged '
            })
        }
        if(payload.role==="admin"){
            req.userid= payload.id
            next()
        }else{
            res.send("something is wrong")
        }
        
        
        
        //payload = id and mail from validation
    })
}