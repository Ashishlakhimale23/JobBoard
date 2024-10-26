import { CreateApplications, Education, JobApplication, workexperience } from "@/types/type"
import { UsersProfile,Projects,Jobs } from "@/types/type";
import {atom, selector} from "recoil"

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
  JobLink:""
}; 


export const workExperienceDefault:workexperience= {
  Role:"",
  Location:"",
  CompanyName:"",
  JoiningYear:"",
  LeavingYear:"",
  AboutJob:{
    type: "doc",
    content: [],
  },
}

export const educationdefault :Education={
  CourseName:"",
  UniLocation:"",
  UniversityName:"",
  StartYear:"",
  EndYear:"",
  AboutCourse:{
    type: "doc",
    content: [],
  },
}

export const projectdefault:Projects={
  Title:"",
  GithubLink:"",
  LiveLink:"",
  AboutProject:{
    type:"doc",
    content:[],
  }
}

export const UserProfileDefault:UsersProfile={
  Name:'',
  Profile:"",
  AboutMe:{
    type: "doc",
    content: [],
  },
  skills:[],
  workExperience:[workExperienceDefault],
  education:[educationdefault],
  Linkedin:"",
  twitter:"",
  Protfolio:"",
  Projects:[projectdefault]

}

//atoms
export const LoggedState = atom<boolean>({
   key:"LoggedState",
   default:false
})



export const UserProfile = atom<UsersProfile>({
   key:"UserProfile",
   default:(()=>{
      const saved = localStorage.getItem("userprofile");
      return saved ? JSON.parse(saved) : UserProfileDefault;
   })()
})

export const SettingsModal = atom<boolean>({
  key:'SettingsModal',
  default:false
  
})

export const ConformationModalState = atom<boolean>({
  key:"Conformation",
  default:false

})

export const OnTap =atom<string>({
  key:"OnTap",
  default:"uploaded"

})

export const authState = atom({
  key: 'authState',
  default: {
    isAuthenticated: false,
    isLoading: true,
  },
});


export const Application = atom<CreateApplications>({
   key:"Applicaton",
   default:(()=>{
      const saved = localStorage.getItem("application");
      return saved ? JSON.parse(saved) : CreateApplicationDefault;
   })()
})

export const JobsApplication = atom<JobApplication[]>({
  key:'Jobs',
  default:[]
})

export const SelectedJobType = atom<Jobs>({
  key:"selectedJobType",
  default:Jobs.jobs
})

export const FilteredJobs = selector({
  key:"FilteredJobs",
  get:({get}) =>{
    const jobs = get(JobsApplication)
    const selected = get(SelectedJobType)

    switch(selected){
      case 'remote':
        return jobs.filter((item)=>item.WorkMode==="Remote")
      case 'fulltime':
        return jobs.filter((item)=>item.Type==="Full Time")
      case 'internship':
        return jobs.filter((item)=>item.Type==="Internship")
      case 'hybrid':
        return jobs.filter((item)=>item.WorkMode==="Hybrid")
      default:
        return jobs
    }
  }
}) 