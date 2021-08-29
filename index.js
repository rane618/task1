require('dotenv').config();
const express=require('express')
const app  = express();
const bcrypt =require("bcrypt")
const jwt=require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const auth =require("./middleware/auth")
require('./db/conn')
const Register=require('./models/user')
const HTTPS_PORT = process.env.HTTPS_PORT || 3000;

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))


app.get("/" ,(req,res) => { 
res.send("index");})

app.get("/secret" ,auth ,(req,res) => { 
  console.log(` this is the cookie awesome ${req.cookies.jwt}`)
  res.send("secret");})

app.get('/login', (req,res) =>
{    res.send("index");})

app.post("/login", async(req,res)=>{
  try{
    const email=req.body.email;
    const password=req.body.password;
   const useremail= await Register.findOne({email:email})

  const isMatch = await bcrypt.compare(password, useremail.password);
   if (isMatch && useremail.email===email){
    res.status(201).send("Login Successfully");
        }
        else{
          res.send("invalid login details");
          }
          const token = await registerPass.generateAuthToken();
          console.log("the token part " + token)
       
          res.cookie("jwt", token, {
           expires:new Date(date.now() + 600000),
           httpsOnly:true,
           //secure:true
         });
         console.log(` this is the cookie awesome ${req.cookies.jwt}`
         )}
catch(error){
    res.status(400).send("Nothing")
}})

app.get('/register',async (req,res) => {
  res.send(Register);})

app.post('/register',async (req,res) => {
  try{
   const password=req.body.password;
   const cpassword=req.body.confirmpassword;
   if(password === cpassword){
    const  registerPass= new Register({
             email: req.body.email,
            password: password,
           confirmpassword:cpassword
    })
    res.status(201).send("Register Successfully")
    const token = await registerPass.generateAuthToken();
    console.log("the token part " + token)

    res.cookie("jwt", token, {
      expires:new Date(date.now() + 600000),
      httpsOnly:true
    });

    const registered =await registerPass.save();
    console.log("the page part" + registered);
    
  }
   else{
     res.send("password are not matching")
   }

  }catch(error){
res.status(400).send(error)
  }
})

app.listen(HTTPS_PORT,()=>{
  console.log(`listening on port ${HTTPS_PORT}`);
})