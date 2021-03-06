const jwt = require("jsonwebtoken");
const Register = require("../models/registers");

const auth = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        console.log(token);
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
        console.log(verifyUser);
        const user = await Register.findOne({_id:verifyUser._id});

        console.log(user);
        req.token = token;
        req.user = user ;
    
        next();
    } catch (error) {
        res.status(401).send("prblm");
    }
}

module.exports = auth;