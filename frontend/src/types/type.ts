import { AxiosError,AxiosResponse } from "axios"
import { JSONContent } from "@tiptap/react"
import { intersection } from "zod"
export interface CustomAxiosError extends AxiosError{
  response?:AxiosResponse<{message:string}>
}
export interface CreateApplications{
  JobTitle:string,
  Category:string,
  WorkMode:string,
  Type:string,
  AverageSalary:number,
  ApplicationLink?:string, 
  Location?:string, 
  Qualification?:JSONContent,
  Responsibilities:JSONContent,
  CompanyLogo:File | string,
  CompanyName:string,
  CompanyEmail:string,
  CompanyOverview:JSONContent 
}

export interface workexperience{
  Role:string,
  Location:string,
  CompanyName:string,
  JoiningYear:string,
  LeavingYear:string,
  AboutJob:JSONContent
}

export interface Education{
  CourseName:string,
  UniLocation:string,
  UniversityName:string,
  StartYear:string,
  EndYear:string,
  AboutCourse:JSONContent
}

export interface Projects{
  Title:string,
  AboutProject:JSONContent,
  GithubLink:string,
  LiveLink:String,
}

export interface UsersProfile{
  Name:string,
  AboutMe:JSONContent,
  skills:string[],
  Profile:string | File,
  workExperience:workexperience[],
  education:Education[]
  Linkedin:string,
  twitter:string
  Protfolio:string,
  Projects:Projects[],
}

export interface JobApplication {
  JobTitle: string;
  WorkMode: string;
  Type: string;
  AverageSalary: number;
  CompanyLogo: string;
  Location: string;
  JobLink:string
}