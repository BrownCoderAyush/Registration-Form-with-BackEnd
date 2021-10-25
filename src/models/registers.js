const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const employeeSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    confirmPassword:{
        type:String,
        required:true,
        // this will create problem in this.confirmPassword = undefined area
        unique:true
    }
    ,
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
}) 
employeeSchema.methods.generateAuthToken = async function(){
    try {
        // this is going to console the id of the object created using new Register 
        // console.log(this._id);

        // this is going to take the id as payload and change the result into a jwt token 
        const token = await jwt.sign({_id:this._id},process.env.SECRET_KEY);
        // this will help in filling the genetated tooken in place of token field in schema 
        this.tokens = this.tokens.concat({token:token});
        // this needs to be called as it is going to save the token in db 
        await this.save();
        // console.log(token);
        
        return token;
    } catch (err) {
        res.send("the error path "+ err);
        console.log(err);
    }
}

// cant use fat arrow function
// employeeSchema.pre("save", async function (next){  
//     // like when we want to update the information then if other than password if we change another field then this hashing will not be done
//     // if(this.isModified("password")){
//    console.log(`the password is - ${this.password}`);
//    this.password = await bcrypt.hash(this.password,8);
// //    this.confirmPassword = await bcrypt.hash(this.confirmPassword,10);
// //    this.confirmPassword = undefined;
//    console.log(`the password after is - ${this.password}`);
//     // }
//    next();

// })

const Register = new mongoose.model("Register",employeeSchema);
module.exports=Register;