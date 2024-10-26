
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
            type:String,
            enum: ["Applied","Under Review","Interviewed","Hired","Rejected"],
            default:"Applied",
        }
    }
    ],
}, {
    timestamps:true
})
export const User = mongoose.model("User",user)