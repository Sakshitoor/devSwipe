const express=require("express");
const connectDb=require("./src/config/database");
const mongoose=require("mongoose");


const cookieParser=require("cookie-parser");
const authRouter=require("./src/routes/auth");
const connectionRequestRouter=require("./src/routes/requests");
const profileRouter=require("./src/routes/profile");
const userRouter=require("./src/routes/user");


// const mongo_Url="mongodb+srv://sakshitoor6:uzrQuW56X8fquwI9@namastenode.trnbg.mongodb.net/devSwipe";
// main()
// .then(()=>{
//     console.log("connected to database");
// })
// .catch((err)=>{
//    console.log(err);
// })
// async function main(){
//     await mongoose.connect(mongo_Url);
// }

const app=express();
app.use(cookieParser());
app.use(express.json());


app.use(authRouter);
app.use(connectionRequestRouter);
app.use(profileRouter);
app.use(userRouter);

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


