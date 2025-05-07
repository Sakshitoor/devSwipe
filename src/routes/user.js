const express=require("express")
const userRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionRequest");
const User = require("../models/user");
const USER_SAFE_DATA=["firstName","lastName","skills","photoUrl","about","age","gender"];
// Get all pending requests for the logged in user
userRouter.get("/user/requests/recieved",userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user;
        const connectionRequests=await ConnectionRequest.find({
 toUserId:loggedInUser._id,
 status:"interested",
        }).populate("fromUserId",USER_SAFE_DATA);
      

            res.json({
                message:"Data fetched successfully",
                data:connectionRequests,
            })

    } catch (error) {
        res.status(400).send("ERROR: "+error.message)
    }
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user;

        const connectionRequests=await ConnectionRequest.find({
            $or:[{toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"}
            ]
            
        }).populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId",USER_SAFE_DATA);
           
        const data=connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){//because we 
            // can't directly check two mongoose id
               return row.toUserId;
            }
            return row.fromUserId
        });

        res.json({data})
        
    } catch (error) {
        res.status(400).send("Error: "+error.message);
    }
})

userRouter.get("/feed",userAuth,async(req,res)=>{
    try {
        //user should see all the user cards except
        //0.his own card
        //1.his connections
        //2.ignored people
        //3.already sent the connection request
        const loggedInUser=req.user;
          
        const page=parseInt(req.query.page)||1
        let limit=parseInt(req.query.limit)||10
        limit=limit>50?50:limit;
        const skip=(page-1)*limit;

        //Find all the connection requests (sent+recieved)
        const connectionRequests=await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        })
        .select("fromUserId toUserId");

        const hiddenUsersFromFeed=new Set();
        connectionRequests.forEach(req=>{
            hiddenUsersFromFeed.add(req.fromUserId.toString());
            hiddenUsersFromFeed.add(req.toUserId.toString());
        })
        const users=await User.find({
            $and:[
                {_id:{$nin: Array.from(hiddenUsersFromFeed)}},
                {_id:{$ne:loggedInUser._id}},
            ]
          
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

            res.send(users);

        //example: Rahul=[mark,dhoni,virat]
        //R-> Akshay->rejected R->Elon->Accepted
    } catch (err) {
        res.status(400).json({
            message:err.message
        })
    }
})

module.exports=userRouter;