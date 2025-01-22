const express=require('express');
const app=express();
app.use((req,res)=>{
    res.send("root");
})
app.listen(3000,()=>{
    console.log("app listening");
})