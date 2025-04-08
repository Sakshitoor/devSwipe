const express=require("express");
const connectionRequestRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User=require("../models/user");

connectionRequestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
 try {
    const fromUserId=req.user._id;
    const toUserId=req.params.toUserId;
    const status=req.params.status;
    
    const allowedStatus=["ignored","interested"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message:"Invalid status type"})
    }
 
    const connectionRequest=new ConnectionRequest({
     fromUserId,
     toUserId,
     status
 
    })

    const toUser=await User.findById(toUserId);
    if(!toUser){
      return res.status(400).json({
         message:"User not found"
      })
    }

    const existingConnectionRequest=await  ConnectionRequest.findOne({
      $or:[
         {fromUserId,toUserId},
         {fromUserId:toUserId,toUserId:fromUserId}    //to check dono ne ek dusre ko request bhej rkhi h kya
      ],
    })
 if(existingConnectionRequest){
   return res.status(400).send("connection request already exists ");
 }
    const data= await connectionRequest.save();
 
    res.json({
     message:req.user.firstName+" "+status+" "+toUser.firstName,
     data
    })
 } catch (error) {
res.status(400).send("ERROR: "+error.message)
 }
})

connectionRequestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
 try{ 
  const loggedInUser=req.user;
  const {status,requestId}=req.params;
  //validate status
  const allowedStatus=["accepted","rejected"];
  if(!allowedStatus.includes(status)){
    return res.status(400).json({message:"Invalid status type"})
  }

//Akshay=>Elon
//loggedInUserId=toUserId
//status=interested
//request Id should be valid

const connectionRequest=await ConnectionRequest.findOne({
  _id:requestId,
  toUserId:loggedInUser._id,
  status:"interested",
})

if(!connectionRequest){
  return res.status(404).json({
    message:"Connection Request not found"
  })
}
connectionRequest.status=status;
const data=await connectionRequest.save();
res.json({
  message:"Connection Request "+status,data
})

}catch(err){
  res.status(400).send("ERROR: "+err.message)
}
})

module.exports=connectionRequestRouter;