const express=require("express");
const profileRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validations");


profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{
       const user=req.user;
       
          res.send(user);
         
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
    
})

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
  try {
    
    if(!validateEditProfileData(req)){
        throw new Error("Invalid request");
    }
const loggedInUser=req.user;
Object.keys(req.body).forEach((key)=> (loggedInUser[key]=req.body[key]));
await loggedInUser.save();
res.send(`${loggedInUser.firstName},your profile is updated`);

  } catch (error) {
    res.status(400).send(error.message);
  }
})

module.exports=profileRouter;