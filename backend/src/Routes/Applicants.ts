import express from "express";
import { upload } from "../Utils/Cloudinary";
import { CreateApplication, GetAllApplications, GetAllApplicationsWithFullTime, GetAllApplicationsWithHybrid, GetAllApplicationsWithInternship, GetAllApplicationsWithRecent, GetAllApplicationsWithRemote } from "../Controllers/Applicants";
import { AuthMidddleware } from "../Middlerware/Auth";
export const ApplicantsRouter = express.Router();
ApplicantsRouter.post('/createapplication',upload.single("CompanyLogo"),AuthMidddleware,CreateApplication)
ApplicantsRouter.get('/getallapplicationjobs',AuthMidddleware,GetAllApplications)
ApplicantsRouter.get('/getallapplicationfulltime',AuthMidddleware,GetAllApplicationsWithFullTime)
ApplicantsRouter.get('/getallapplicationremote',AuthMidddleware,GetAllApplicationsWithRemote)
ApplicantsRouter.get('/getallapplicationhybrid',AuthMidddleware,GetAllApplicationsWithHybrid)
ApplicantsRouter.get('/getallapplicationinternship',AuthMidddleware,GetAllApplicationsWithInternship)
ApplicantsRouter.get('/getallapplicationrecent',AuthMidddleware,GetAllApplicationsWithRecent)