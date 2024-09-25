import express from "express";
import { upload } from "../Utils/Cloudinary";
import { CreateApplication } from "../Controllers/Applicants";
import { AuthMidddleware } from "../Middlerware/Auth";
export const ApplicantsRouter = express.Router();
ApplicantsRouter.post('/createapplication',upload.single("CompanyLogo"),AuthMidddleware,CreateApplication)
