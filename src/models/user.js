const mongoose=require("mongoose");
const validator=require("validator");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

const userSchema=new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
          
        },
        lastName:{
            type:String
        },
        emailId:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            // validate(value){
            //     if(!validator.isEmail(value)){
            //         throw new error("Invalid Email"+ value);
            //     }
            // }
        },
       
        password:{
            type:String,
            required:true,
        },
        age: {
            type: Number,
            min: 18,
          },
        gender: {
            type: String,
            enum: {
              values: ["male", "female", "other"],
              message: `{VALUE} is not a valid gender type`,
            }},
         about: {
                type: String,
                default: "This is a default about of the user!",
              },
         skills: {
                type: [String],
              },
            
     
    }
    ,{timestamps:true}
)

userSchema.index({firstName:1});
userSchema.index({gender:1});
userSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({_id :user._id},"devSwipe$229",{expiresIn:"7d"});
    return token;
}
userSchema.methods.validatePassword=async function(passwordInputByUser){
    const user=this;
    const passwordHash=user.password;
    const isValidPassword=await bcrypt.compare(passwordInputByUser,passwordHash);
    return isValidPassword;
}

const User=mongoose.model("User",userSchema);

module.exports=User;