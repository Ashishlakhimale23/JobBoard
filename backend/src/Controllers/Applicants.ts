import { Application } from "../Models/Application";
import { Request,Response } from "express"
import { CloudinaryUpload } from "../Utils/CloudinaryUpload";
import { User } from "../Models/user";
import { RemoveAnySpaces } from "../Utils/RemoveSpaces";
import mongoose from "mongoose"

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
        const response = await Application.find({Type:'Full Time'}).select("JobTitle WorkMode Location Type AverageSalary JobLink CompanyLogo");
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
        const response = await Application.find({WorkMode:'Remote'}).select("JobTitle JobLink WorkMode Location Type AverageSalary CompanyLogo");
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
        const response = await Application.find({WorkMode:'Hybrid'}).select("JobTitle WorkMode JobLink Location Type AverageSalary CompanyLogo");
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
        const response = await Application.find({Type:'Internship'}).select("JobTitle JobLink WorkMode Location Type AverageSalary CompanyLogo");
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
        const response = await Application.find({}).sort({createdAt:-1}).select("JobTitle WorkMode Location Type AverageSalary CompanyLogo JobLink");
        if(!response.length){
            return res.status(404).json({ message: 'No applications found' });
        }
        return res.status(200).json({Data:response});
    }catch(error){
        return res.status(500).json({message:'internal error'})
    }
}

export const GetParticularJob=async(req:Request,res:Response)=>{
    const uid = req.uid
    const jobLink = req.query.jobLink as string;
    console.log(jobLink);
    if(!jobLink){
        return res.status(404).json({message:"no joblink"})
    }
    try{
        const response = await Application.findOne({JobLink:jobLink});
        
        console.log(response?._id)
        const useruploaded = await User.findOne({firebaseUid:uid,JobUploaded:{$in:[response?._id]}})
        console.log(useruploaded)
        const userapplied = await User.findOne({firebaseUid:uid,Application:{$elemMatch:{ApplicationID:response?._id}}})
        console.log(userapplied)
        let appliedoruploder = userapplied != null || useruploaded != null ? true : false;
        if(!response){
            return res.status(404).json({message:"No application found"});
        }
        return res.status(200).json({Data:response,applybutton:appliedoruploder});
    }catch(error){
        return res.status(500).json({message:'internal server error'})
    }
}

export const EditProfile=async(req:Request,res:Response)=>{
    const uid = req.uid
    if(!req.body){
        return res.status(400).json({message:"no data provided"})
    }
    console.log(req.body)
    const {Name,
  AboutMe,
  workExperience,
  Profile,
  education,
  Linkedin,
  twitter,skills,
Portfolio,Projects} = req.body
    try{
         let Image
        if(req.file) {
           Image = await CloudinaryUpload(req.file); 
        const response = await User.findOneAndUpdate({firebaseUid:uid},{Name:Name,AboutMe:AboutMe,workExperience:workExperience,education:education,Linkedin:Linkedin,twitter:twitter,Profile:Image,skills:skills,Portfolio:Portfolio,Projects:Projects})
        if(!response){
            return res.status(500).json({message:"internal server error"});
        }
        }
        const response = await User.findOneAndUpdate({firebaseUid:uid},{Name:Name,AboutMe:AboutMe,workExperience:workExperience,education:education,Linkedin:Linkedin,twitter:twitter,Profile:Profile,skills:skills,Portfolio:Portfolio,Projects:Projects})
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

export const ApplyForJob=async(req:Request<{},{},{joblink:string}>,res:Response)=>{
    const uid =req.uid;
    console.log(req.body)
    const {joblink} = req.body;
    if(!joblink){
        return res.status(400).json({message:"no joblink provided"})
    }
    try{
        const user = await User.findOne({firebaseUid:uid});
        if(!user){
            return res.status(400).json({message:"user doesnt exist"});
        }
        const check = await Application.findOne({JobLink:joblink,Applicants:{$elemMatch:{ApplicantID:user._id}}})
        if(check != null){
            return res.status(400).json({message:"already applied"})
        }
        const response = await Application.findOneAndUpdate({JobLink:joblink},{$push:{'Applicants':{ApplicantsID:user._id,status:"Applied"}}});
        const result = await User.findOneAndUpdate({firebaseUid:uid},{$push:{'Application':{ApplicationID:response?._id,status:"Applied"}}})
        if(!response || !result){
            return res.status(500).json({message:"internal server error"})
        }
        return res.status(200).json({message:"Applied"});
    }catch(error){
        return res.status(500).json({message:'internal server error'});
    }

}


export const GetUploadedJobs=async(req:Request,res:Response)=>{
    const uid =req.uid;
    try{
        const response = await User.findOne({firebaseUid:uid}).select("JobUploaded").populate({
            path:'JobUploaded',
            select:'JobTitle WorkMode Location Type AverageSalary CompanyLogo JobLink'
        });
        console.log(response)
        if(!response){
            return res.status(500).json({message:"internal server error"})
        }
        return res.status(200).json({Data:response})

    }catch(error){
        console.log(error)
        return res.status(500).json({message:"internal server error"})

    }
}

export const GetAppliedforJobs=async(req:Request,res:Response)=>{
    const uid =req.uid;
    try{
    const response = await User.findOne({firebaseUid:uid}).select('Application').populate({
            path:'Application.ApplicationID',
            select:'JobTitle WorkMode Location Type AverageSalary CompanyLogo JobLink',
        });
        console.log(response)
        if(!response){
            return res.status(500).json({message:"internal server error"})
        }
        return res.status(200).json({Data:response})

    }catch(error){
        console.log(error)
        return res.status(500).json({message:"internal server error"})

    }
}

export const GetApplicants = async (req: Request, res: Response) => {
    const uid = req.uid;
    const jobLink = req.query.JobLink as string;

    if (!jobLink) {
        return res.status(400).json({ message: "JobLink is required" });
    }

    try {
       
        const application = await Application.findOne({ JobLink: jobLink })
            .select('Applicants')
            .populate({
                path: 'Applicants.ApplicantsID',
                select: {
                    email: 1,
                    Name: 1,
                    Profile: 1,  
                    skills: { $slice: 3 }
                }
            });

        if (!application) {
            return res.status(400).json({ message: "Job application not found" });
        }

       
        const user = await User.findOne({
            firebaseUid: uid,
            JobUploaded: application._id  
        });

        if (!user) {
            return res.status(403).json({ message: "You don't have permission to view these applicants" });
        }

        return res.status(200).json({
            Data: application
        });

    } catch (error) {
        console.error('Error in GetApplicants:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateApplicantStatus = async (req: Request, res: Response) => {
  const { JobLink, applicantId, newStatus } = req.body;
  const uid = req.uid; 

  if (!JobLink || !applicantId || !newStatus) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const application = await Application.findOne({
      JobLink,
      Applicants:{$elemMatch:{ApplicantsID: applicantId}}
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const user = await User.findOne({
      firebaseUid: uid,
      JobUploaded: application._id
    });

    if (!user) {
      return res.status(403).json({ message: "You don't have permission to update this application" });
    }

    console.log(applicantId)

    const updatedApplication = await Application.findOneAndUpdate(
      {
        JobLink,
      Applicants:{$elemMatch:{ApplicantsID: applicantId}}
      },
      {
        $set: {
          'Applicants.$.status': newStatus
        }
      },
      { new: true }
    );
    if (!updatedApplication) {
      return res.status(404).json({ message: "Failed to update status" });
    }

    const updateOnUserSide = await User.findOneAndUpdate({_id:applicantId,Application:{$elemMatch:{ApplicationID:updatedApplication._id}}},{$set:{"Application.$.status":newStatus}})
    

    if(!updateOnUserSide){
        return res.status(500).json({message:"internal server error"})
    }
    
    return res.status(200).json({
      message: "Status updated successfully",
      data: updatedApplication
    });

  } catch (error) {
    console.error('Error updating applicant status:', error);
    res.status(500).json({ message: "Internal server error" });
  }
 };

export const DeleteJob=async(req:Request,res:Response)=>{
    const uid = req.uid;
    const JobLink = req.query.JobLink
    if(!JobLink){
        return res.status(403).json({message:"JobLink not provided"})
    }
    try{
        const job = await Application.findOne({JobLink:JobLink}) 
        if(!job){
            return res.status(500).json({message:"no job found"})
        }
        const check = await User.findOne({firebaseUid:uid,JobUploaded:job._id})
        if(!check){
            return res.status(500).json({message:'naughty hora ke'})
        }
        const deleteapplied = await User.updateMany({'Application.ApplicationID':job._id},{$pull:{Application:{ApplicationID:job._id}}})
        const deleteApp = await Application.deleteOne({JobLink:JobLink})
        if(!deleteApp){
            return res.status(500).json({message:"deletion failed"})
        }
        check.JobUploaded = check.JobUploaded.filter((ele)=>ele.toString()!=job._id.toString()) 
        await check.save();
        return res.status(200).json({message:"deleted successfully"})

    }catch(error){
        return res.status(500).json({message:"internal server error"})
    }

}