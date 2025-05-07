const express=require("express");
const authRouter=express.Router();
const bcrypt=require("bcrypt");
const User=require("../models/user");
const jwt=require("jsonwebtoken");
const { validateSignUp } = require("../utils/validations");

authRouter.post("/signup",async(req,res)=>{
   
   
    try{
        validateSignUp(req);
        
        
        const {firstName,lastName,emailId,password}=req.body;

         const passwordHash=await bcrypt.hash(password,10);

         const user=new User(
            {
                firstName,
                lastName,
                emailId,
                password:passwordHash,
                
            }
         );

        const savedUser=await user.save();
        const token=await savedUser.getJWT();
        // console.log(token);
    
       // add token to the cookie and send the response back to user
        res.cookie("token",token);
        return res.json({
            message:"New user added successfully",
            data:savedUser,
        });
    }
    
    catch(err){
        return res.status(400).send("ERROR: "+err.message);
    }
})

authRouter.post("/login",async(req,res)=>{
    try{
    const {emailId,password}=req.body;

    const user=await User.findOne({emailId:emailId});
    if(!user){
        throw new Error("Invalid Credentials");
    }

    const isValidPassword=await user.validatePassword(password) ;
    if(isValidPassword){
         //Create a token
         const token=await user.getJWT();
        // console.log(token);
    
       // add token to the cookie and send the response back to user
        res.cookie("token",token);
       return res.send(user);
        //console.log(cookie);
    }
    else{
        throw new Error("Invalid credentials");
    }
}catch(err){
    if(err){
       return res.status(400).send("Error: "+err.message);
    }
}
})

authRouter.post("/logout",(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    })
    return res.send("logged out")
})
module.exports=authRouter;