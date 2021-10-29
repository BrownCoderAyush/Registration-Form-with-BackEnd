require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const { read } = require("fs");
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

const port = process.env.PORT || 8000;
const app = express();
require("../src/db/conn");
const path = require("path");
const Register = require("../src/models/registers");

const static_path = path.join(__dirname, "../public");

app.use(express.static(static_path));

app.set("view engine", "hbs");
// for customized views directory 
app.set("views", path.join(__dirname, "../templete/views"));

// for registering the use of partials 
hbs.registerPartials(path.join(__dirname, "../templete/partials"));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// console.log(process.env.SECRET_KEY);
// console.log(typeof(process.env.SECRET_KEY));

app.get("/", (req, res) => {
    res.render("index");
})
app.get("/secret",auth,(req,res)=>{
    console.log(req.user);

    // console.log(`this is awsome ${req.cookies.jwt}`);
    
    res.render("secret");
}) 
app.get("/logout",auth,async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((currElement)=>{
            return currElement.token != req.token ;
        })

        res.clearCookie("jwt");
        console.log(req.user);
        await req.user.save();
        console.log("login");

        res.render("login");
    } catch (error) {
        res.status(500).send(error);
    }
})

app.get("/login", (req, res) => {
    res.render("login");
})
app.post("/login", async (req, res) => {
    try {
        // console.log(email);
        // console.log(password);
        // console.log(Data);
        // console.log(Data.pass word);
        // console.log(password);
        const email = req.body.email;
        const password = req.body.password;
      
        
        const Data = await Register.findOne({ email: email });
        // console.log("hashed password is~~~~~~~");
        // console.log(password);
        // console.log( await bcrypt.hash(password,10)); 
        // console.log("Database password is~~~~~~~");
        // console.log(Data.password);
        // const isMatched = await bcrypt.compare(password, Data.password);
        const token = await Data.generateAuthToken();
        // console.log(token);
        // console.log(isMatched);
        res.cookie("jwt",token,{expires:new Date(Date.now() + 30000)});
        if (password==Data.password) {
            res.render("index");
        }
        else {
            res.send("not valid combination");
        }
    } catch (error) {
        res.status(400).send("invalid");
    }
})
app.get("/register", (req, res) => {
    res.render("register");
})
app.post("/register", async (req, res) => {

    try {
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        if (password === confirmPassword) {
            const registerEmployee = new Register({
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                gender: req.body.gender,
                confirmPassword: req.body.confirmPassword,
                phone: req.body.Phone,
            });
        // console.log(`the success part is ~~~ ${registerEmployee}`);
        // this is going to run the generateAuthToken function present in registerEmployee

        const token = await registerEmployee.generateAuthToken();
        // console.log(token);

        res.cookie("jwt",token,{expires:new Date(Date.now() + 30000)
        , httpOnly : true});

            const register = await registerEmployee.save();
            res.render("index");
        } else {
            res.send("Password is not matching");
        }


    } catch (error) {
        res.send(error);
    }

    // console.log(req.body.email);
    // console.log(req.body.password);
    // console.log(req.body);
    // res.send(req.body);
})
// const createToken = async ()=>{
//     const token = await jwt.sign({_id:1234},"ayushIzOpzzzzzzzzzzzzzzzzzzcccccccccccccccccccccccccccccccccc",{
//         expiresIn:"2 minutes"
//     });
//     console.log(token);
//     const isVerify = await jwt.verify(token,"ayushIzOpzzzzzzzzzzzzzzzzzzcccccccccccccccccccccccccccccccccc");
//     console.log(isVerify);
// }
// createToken();


app.listen(port, () => {
    console.log(`server running at port no ${port}`);
})

// const Bcrypt = async (password)=>{
//     const passwordHash =await bcrypt.hash(password,10);
//     console.log(passwordHash);
//     const passwordSrch = await bcrypt.compare(password,passwordHash);
//     console.log(passwordSrch);
// }
// Bcrypt("ayush");