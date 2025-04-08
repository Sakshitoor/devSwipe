const mongoose  = require("mongoose");
const User = require("./user");

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,//ref to user collection
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    status:{
      type:String,
      enum:{
        values:["ignored","interested","accepted","rejected"],
        message:`{VALUE} is incorrect status type`
      },
      required:true
    }
},{ timestamps:true});


connectionRequestSchema.pre("save",function(next){
  const connectionRequest=this;
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error ("Can't send connection request to yourself")
  }
  next();
})

connectionRequestSchema.index({fromUserId:1,toUserId:1})

 const ConnectionRequest=mongoose.model("ConnectionRequest",connectionRequestSchema);
 module.exports=ConnectionRequest;