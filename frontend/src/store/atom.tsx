import { CreateApplications } from "@/types/type"
import {atom} from "recoil"
//Default
export const CreateApplicationDefault:CreateApplications ={
   JobTitle:"",
   Category:"Design",
   WorkMode:"Remote",
   Type:"Full Time",
   JobDescription:{
    type: "doc",
    content: [],
  }, 
   ApplicationLink:"",
   MaxSalary:0,
   MinSalary:0,
   CompanyLogo:"",
   CompanyName:"",
   CompanyEmail:"",
   CompanyBio:{
    type: "doc",
    content: [],
  }, 
} 



//atoms
export const LoggedState = atom<boolean>({
   key:"LoggedState",
   default:false
})

export const Application = atom<CreateApplications>({
   key:"Applicaton",
   default:(()=>{
      const saved = localStorage.getItem("Application");
      return saved ? JSON.parse(saved) : CreateApplicationDefault;
   })()
})