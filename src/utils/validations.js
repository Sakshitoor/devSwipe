const validator=require("validator");

const validateSignUp=(req)=>{
const {firstName,lastName,emailId,password}=req.body;
    if(!firstName || !lastName){
        throw new Error("please enter name properly");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Invalid Email");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter strong password");
    }
}

const validateEditProfileData=(req,res)=>{
 const allowedEditFields=["firstName","lastName","age","about","gender","photoUrl"];

 const isEditAllowed=Object.keys(req.body).every((field)=>
allowedEditFields.includes(field)
)

return isEditAllowed;
}

module.exports={validateSignUp,validateEditProfileData};