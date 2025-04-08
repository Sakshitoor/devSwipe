const jwt=require("jsonwebtoken");
const User=require("../models/user")

const userAuth=async(req,res,next)=>{
    try{//read the token from req cookies
        const {token}=req.cookies;
        if(!token){
            throw new Error("Invalid token");
        }
        // console.log(token);
        //validate the token
        const decodedObj=jwt.verify(token,"devSwipe$229");
        const {_id}=decodedObj;
         //find the user
         const user=await User.findById(_id);
        //  console.log(user);
         if(!user){
            throw new Error("User not found");
            
        }
        req.user=user;
        next();
        }
        catch(err){
            res.status(400).send("Error: "+err.message)
        }

}
module.exports={userAuth};