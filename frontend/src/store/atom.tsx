import { CreateApplications } from "@/types/type"
import {atom} from "recoil"
//Defaults
export const CreateApplicationDefault: CreateApplications = {
  JobTitle: "",
  Category: "Design",
  WorkMode: "Remote",
  Type: "Full Time",
  Responsibilities: {
    type: "doc",
    content: [],
  },
  Qualification: {
    type: "doc",
    content: [],
  },
  ApplicationLink: "",
  AverageSalary: 0,
  CompanyLogo: "",
  CompanyName: "",
  CompanyEmail: "",
  CompanyOverview: {
    type: "doc",
    content: [],
  },
}; 



//atoms
export const LoggedState = atom<boolean>({
   key:"LoggedState",
   default:false
})

export const Application = atom<CreateApplications>({
   key:"Applicaton",
   default:(()=>{
      const saved = localStorage.getItem("application");
      return saved ? JSON.parse(saved) : CreateApplicationDefault;
   })()
})