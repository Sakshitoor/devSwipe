const express=require("express");
const connectDb=require("./src/config/database");
const mongoose=require("mongoose");
const cors=require("cors")

const cookieParser=require("cookie-parser");
const authRouter=require("./src/routes/auth");
const connectionRequestRouter=require("./src/routes/requests");
const profileRouter=require("./src/routes/profile");
const userRouter=require("./src/routes/user");
const app=express();


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

app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true,
    }
));

app.use(express.json());
app.use(cookieParser());


app.use(authRouter);
app.use(connectionRequestRouter);
app.use(profileRouter);
app.use(userRouter);
//app.use("/profile", profileRouter);

connectDb()
.then(()=>{
    console.log("connection successful");
const port=7777;
    app.listen(port,()=>{
        console.log(`server started on ${port}`);
    })
})
.catch((err)=>{
    console.error("connection failure");
})


