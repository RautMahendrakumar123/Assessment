const jsonwebtoken=require("jsonwebtoken")
const dotenv=require("dotenv")
dotenv.config()

module.exports = (req, resp, next)=>{
    // console.log(req.headers);
    if (!req.headers.authorization) {
        return resp.status(404).json({
            message:'You Must Be Logged In First'
        })
    }
    let token = req.headers.authorization
    jsonwebtoken.verify(token, process.env.SECRET_KEY, (err, payload)=>{
        if (err) {
           return resp.status(404).json({
                message:'You Must Be Logged '
            })
        }
        req.userid= payload.id
        //payload = id and mail from validation
        next()
    })
}