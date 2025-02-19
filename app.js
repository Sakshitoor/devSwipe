const express=require("express");
const connectDb=require("./src/config/database");
const User=require("./src/models/user");

const app=express();

app.post("/signup",async(re,res)=>{
    const user=new User(
        {
            firstName:"Sakshi",
            lastName:"toor",
            emailId:"sakshitoorgmail.com",
            password:"sakshitoor"
        }
    )
    await user.save();
    res.send("new user added");
})

connectDb()
.then(()=>{
    console.log("connection successful");

    app.listen(7777,()=>{
        console.log("server started");
    })
})
.catch((err)=>{
    console.error("connection failure");
})


