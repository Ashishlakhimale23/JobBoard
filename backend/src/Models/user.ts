
import mongoose from "mongoose";
const user = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    firebaseUid:{
        type:String,
        required:true 
    },
    Name:{
        type:String,
        required:true,
        unique:true
    },
    Profile:{
        type:String,
        default:"https://res.cloudinary.com/ddweepkue/image/upload/v1719301620/coursefiles/0cecfa5bd56a3a089467769c9ede571e.jpg",
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
        // type JSON 
        type:[{}]
    },
    workExperience:{
        type:[{}]
    },
    education:{
        type:[{}]
    },
    Portfolio:{
        type:String,
    },
    Projects:{
        type:[{}]
    },
    JobUploaded:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Application"
    }],
    Application:[{
        ApplicationID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Application"
        },
        status:{
            type:mongoose.Schema.Types.String,
            ref:'Application'
        }
    }
    ],
}, {
    timestamps:true
})
export const User = mongoose.model("User",user)