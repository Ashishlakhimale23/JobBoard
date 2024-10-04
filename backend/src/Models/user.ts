import { required } from "joi";
import mongoose from "mongoose";
const user = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
    },
    firebaseUid:{
        type:String,
        required:true 
    },
    Name:{
        type:String,
    },
    Profile:{
        type:String,
        default:"https://res.cloudinary.com/ddweepkue/image/upload/v1724660793/q2bq6n1v3xggakyprama.jpg",
    },
    Linkedin:{
        type:String,
    },
    twitter:{
        type:String,
    },
    skills:{
        type:[String],
    },
    AboutMe:{
        type:[{}]
    },
    workExperience:{
        type:[{}]
    },
    education:{
        type:[{}]
    },
    JobUploaded:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Applicant"
    }],
    Application:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Applicant"
    }],
    },{
    timestamps:true
})
export const User = mongoose.model("User",user)