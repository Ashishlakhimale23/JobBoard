import mongoose from "mongoose";
const user = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String
    },
    firebaseUid:{
        type:String,
        required:true },
    JobUploaded:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"space"
    }],
    Application:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"space"
    }],
    },{
    timestamps:true
})
export const User = mongoose.model("User",user)