import { Router } from "express";
import { handlelogin, handlesignin } from "../Controllers/User";
export const userrouter = Router()
userrouter.post("/signup",handlesignin)
userrouter.post("/login",handlelogin)