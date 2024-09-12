require('dotenv').config()
const jwt = require('jsonwebtoken')

//create an athentication
const auth = async (req,res,next)=>{
    try {
        //get authorization header
        const auth =await req.headers.authorization;
        if(!auth){
            return res.status(401).json({
                message:'See the admin for authorization'
            })
        }else{
            //get the token from the authorization header
            const token = await auth.split(' ')[1]
            if(token){
                jwt.verify(token, process.env.JWT_SECRET, (error, payload)=>{
                    if(error){
                        res.json({
                            message: ' Error trying to verify user.'
                        })
                    }else{
                        res.user = payload
                        next()
                    }
                })
            }else{
                res.status(404).json({
                    message:'Admin does not have a token'
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = auth