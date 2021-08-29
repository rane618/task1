const mongoose = require("mongoose");
const bcrypt =require("bcrypt")
const jwt=require("jsonwebtoken")

const registerSchema = new mongoose.Schema({
  email: { type: String, required:true},
  password: { type: String,required:true },
  confirmpassword: { type: String ,required:true},
  tokens:[{
    token:{
      type:String,
      required:true
    } }]
});
//generating token
registerSchema.methods.generateAuthToken= async function () {
  try {
    const token =await jwt.sign({_id:this._id}, process.env.SECRET_KEY)
    this.tokens= this.tokens.concat({token})
      await this.save();
      return token
  }catch(error){
    res.send("the error part" + error)
  console.log("the error part" + error)
  }


}
registerSchema.pre("save", async function(next){
  if (this.isModified("password")){
    this.password=await bcrypt.hash(this.password, 10)
    this.confirmpassword =await bcrypt.hash(this.password, 10)
  }
  next()

})
module.exports =new  mongoose.model("Register", registerSchema);