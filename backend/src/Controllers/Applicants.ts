import { Application } from "../Models/Application";
import { Request,Response } from "express"
import { CloudinaryUpload } from "../Utils/CloudinaryUpload";
import { User } from "../Models/user";
export const CreateApplication =async (req:Request,res:Response)=>{
    const uid = req.uid
    if(!req.body){
        return res.status(400).json({message:"application field is empty."})
    }
    const {Category,MaxSalary,MinSalary,Type,WorkMode,Location,ApplicationLink,JobDescription,JobTitle,CompanyBio,CompanyEmail,CompanyName} = req.body;
    try{

        if(!req.file) {
            return res.status(400).json({message:"No company logo"})
        }
        const Image = await CloudinaryUpload(req.file); 

        const Createdapplication = new Application({
            Category,
            MaxSalary,
            MinSalary,
            Type,
            WorkMode,
            Location,
            ApplicationLink,
            JobDescription,
            JobTitle,
            CompanyBio,
            CompanyEmail,
            CompanyLogo:Image,
            CompanyName
        })
        const response = await Createdapplication.save();
        if(!response){
            return res.status(500).json({message:"internal server error"});
        }
        const result = await User.findOneAndUpdate({firebaseUid:uid},{$push:{"JobUploaded":response._id}})
        if(!result){

            return res.status(500).json({message:'internal server error'});
        }
        
        return res.status(201).json({message:"application uploaded"});
    }catch(error){
        return res.status(500).json({message:"internal server error"});
    }

}