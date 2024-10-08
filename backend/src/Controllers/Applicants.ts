import { Application } from "../Models/Application";
import { Request,Response } from "express"
import { CloudinaryUpload } from "../Utils/CloudinaryUpload";
import { User } from "../Models/user";
import { RemoveAnySpaces } from "../Utils/RemoveSpaces";
export const CreateApplication =async (req:Request,res:Response)=>{
    const uid = req.uid
    if(!req.body){
        return res.status(400).json({message:"application field is empty."})
    }
    const {Category,AverageSalary,Type,WorkMode,Location,ApplicationLink,Responsibilities,Qualification,JobTitle,CompanyOverview,CompanyEmail,CompanyName} = req.body;
    let jobLink:string ; 
    let companyname = JobTitle.replace(/\s+/g,' ').trim();
    let name = RemoveAnySpaces(JobTitle)

    try{

          const resp:number = await Application.countDocuments({ JobLink: companyname })
            jobLink = `${resp ? name+resp :name}`
            const resultnoofjobs:number = await Application.countDocuments({JobLink:jobLink})
            let NoOfSpaces:number = resultnoofjobs ? resp + resultnoofjobs : resultnoofjobs
            jobLink =`${resultnoofjobs ? name + NoOfSpaces : jobLink}`
            
        if(!req.file) {
            return res.status(400).json({message:"No company logo"})
        }
        const Image = await CloudinaryUpload(req.file); 

        const Createdapplication = new Application({
            Category,
            AverageSalary,
            Type,
            WorkMode,
            Location,
            ApplicationLink,
            Qualification,
            Responsibilities,
            JobTitle,
            CompanyOverview,
            CompanyEmail,
            CompanyLogo:Image,
            CompanyName:companyname,
            JobLink:jobLink

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


export const GetAllApplications=async(req:Request,res:Response)=>{
    const uid = req.uid;
    try{
        const profile = await User.findOne({firebaseUid:uid}).select('Profile Name');
        const response = await Application.find().select("JobTitle WorkMode Location Type AverageSalary CompanyLogo JobLink");
        return res.status(200).json({Data:response,Profile:profile});
    }catch(error){
        return res.status(500).json({message:'internal error'})
    }
}
export const GetAllApplicationsWithFullTime=async(req:Request,res:Response)=>{
    try{
        const response = await Application.find({Type:'Full Time'}).select("JobTitle WorkMode Location Type AverageSalary CompanyLogo");
        if(!response.length){
            return res.status(404).json({ message: 'No applications found' });
        }
        return res.status(200).json({Data:response});
    }catch(error){
        return res.status(500).json({message:'internal error'})
    }
}
export const GetAllApplicationsWithRemote=async(req:Request,res:Response)=>{
    try{
        const response = await Application.find({WorkMode:'Remote'}).select("JobTitle WorkMode Location Type AverageSalary CompanyLogo");
        if(!response.length){
            return res.status(404).json({ message: 'No applications found' });
        }
        return res.status(200).json({Data:response});
    }catch(error){
        return res.status(500).json({message:'internal error'})
    }
}
export const GetAllApplicationsWithHybrid=async(req:Request,res:Response)=>{
    try{
        const response = await Application.find({WorkMode:'Hybrid'}).select("JobTitle WorkMode Location Type AverageSalary CompanyLogo");
        if(!response.length){
            return res.status(404).json({ message: 'No applications found' });
        }
        return res.status(200).json({Data:response});
    }catch(error){
        return res.status(500).json({message:'internal error'})
    }
}
export const GetAllApplicationsWithInternship=async(req:Request,res:Response)=>{
    try{
        const response = await Application.find({Type:'Internship'}).select("JobTitle WorkMode Location Type AverageSalary CompanyLogo");
        if(!response.length){
            return res.status(404).json({ message: 'No applications found' });
        }
        return res.status(200).json({Data:response});
    }catch(error){
        return res.status(500).json({message:'internal error'})
    }
}
export const GetAllApplicationsWithRecent=async(req:Request,res:Response)=>{
    try{
        const response = await Application.find({}).sort({createdAt:-1}).select("JobTitle WorkMode Location Type AverageSalary CompanyLogo");
        if(!response.length){
            return res.status(404).json({ message: 'No applications found' });
        }
        return res.status(200).json({Data:response});
    }catch(error){
        return res.status(500).json({message:'internal error'})
    }
}

export const GetParticularJob=async(req:Request,res:Response)=>{
    console.log(req)
    const jobLink = req.query.jobLink as string;
    console.log(jobLink);
    if(!jobLink){
        return res.status(404).json({message:"no joblink"})
    }
    try{
        const response = await Application.findOne({JobLink:jobLink});
        if(!response){
            return res.status(404).json({message:"No application found"});
        }
        return res.status(200).json({Data:response});
    }catch(error){
        return res.status(500).json({message:'internal server error'})
    }
}

export const EditProfile=async(req:Request,res:Response)=>{
    const uid = req.uid
    if(!req.body){
        return res.status(400).json({message:"no data provided"})
    }
    const {Name,
  AboutMe,
  workExperience,
  Profile,
  education,
  Linkedin,
  twitter,skills,
Portfolio} = req.body
    try{
         let Image
        if(req.file) {
           Image = await CloudinaryUpload(req.file); 
        const response = await User.findOneAndUpdate({firebaseUid:uid},{Name:Name,AboutMe:AboutMe,workExperience:workExperience,education:education,Linkedin:Linkedin,twitter:twitter,Profile:Image,skills:skills,Portfolio:Portfolio})
        if(!response){
            return res.status(500).json({message:"internal server error"});
        }
        }
        const response = await User.findOneAndUpdate({firebaseUid:uid},{Name:Name,AboutMe:AboutMe,workExperience:workExperience,education:education,Linkedin:Linkedin,twitter:twitter,Profile:Profile,skills:skills,Portfolio:Portfolio})
        if(!response){
            return res.status(500).json({message:"internal server error"});
        }

        
        
        return res.status(200).json({message:"profile edited"});
    }catch(error){
        return res.status(500).json({message:"internal server error"});
    }

}

export const GetUserData=async(req:Request,res:Response)=>{
    const uid = req.uid;
    const username = req.query.username;
    let admin=false;
    if(!username){
        return res.status(400).json({message:"username not provided"});
    }
    try{
        const response = await User.findOne({Name:username})
        if(uid === response?.firebaseUid){
            admin =true
        }
        if(!response){
            return res.status(500).json({message:"internal server error"})
        }
        return res.status(200).json({Data:response,admin:admin});
        
    }catch(error){
        return res.status(500).json({message:"internal server error"})
    }
}

export const GetUser=async(req:Request,res:Response)=>{
    const uid = req.uid;
    
    try{

        const response = await User.findOne({firebaseUid:uid});
        if(!response){
            return res.status(500).json({message:"internal server error"})
        }
        return res.status(200).json({Data:response});
        
    }catch(error){
        return res.status(500).json({message:"internal server error"})
    }
}