import express from "express";
import { upload } from "../Utils/Cloudinary";
import { ApplyForJob, CreateApplication, EditProfile, GetAllApplications, GetAllApplicationsWithFullTime, GetAllApplicationsWithHybrid, GetAllApplicationsWithInternship, GetAllApplicationsWithRecent, GetAllApplicationsWithRemote, GetApplicants, GetAppliedforJobs, GetParticularJob, GetUploadedJobs, GetUser, GetUserData, updateApplicantStatus } from "../Controllers/Applicants";
import { AuthMidddleware } from "../Middlerware/Auth";
export const ApplicantsRouter = express.Router();

ApplicantsRouter.post('/createapplication',upload.single("CompanyLogo"),AuthMidddleware,CreateApplication)
ApplicantsRouter.get('/getallapplicationjobs',AuthMidddleware,GetAllApplications)
ApplicantsRouter.get('/getallapplicationfulltime',AuthMidddleware,GetAllApplicationsWithFullTime)
ApplicantsRouter.get('/getallapplicationremote',AuthMidddleware,GetAllApplicationsWithRemote)
ApplicantsRouter.get('/getallapplicationhybrid',AuthMidddleware,GetAllApplicationsWithHybrid)
ApplicantsRouter.get('/getallapplicationinternship',AuthMidddleware,GetAllApplicationsWithInternship)
ApplicantsRouter.get('/getallapplicationrecent',AuthMidddleware,GetAllApplicationsWithRecent)
ApplicantsRouter.get('/particularjob',AuthMidddleware,GetParticularJob)
ApplicantsRouter.post("/editprofile",upload.single("Profile"),AuthMidddleware,EditProfile)
ApplicantsRouter.get("/getuserdata",AuthMidddleware,GetUserData)
ApplicantsRouter.get('/getuser',AuthMidddleware,GetUser)
ApplicantsRouter.post('/sumbitapplication',AuthMidddleware,ApplyForJob)
ApplicantsRouter.get("/getjobuploaded",AuthMidddleware,GetUploadedJobs)
ApplicantsRouter.get("/getappliedjobs",AuthMidddleware,GetAppliedforJobs);
ApplicantsRouter.get("/getapplicants",AuthMidddleware,GetApplicants)
ApplicantsRouter.patch("/updatestatus",AuthMidddleware,updateApplicantStatus);