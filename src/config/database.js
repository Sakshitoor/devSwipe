const mongoose=require("mongoose");


const connectDb=async ()=>{
 await mongoose.connect("mongodb+srv://sakshitoor6:uzrQuW56X8fquwI9@namastenode.trnbg.mongodb.net/devSwipe?retryWrites=true&w=majority&appName=NamasteNode");
}
module.exports=connectDb;

