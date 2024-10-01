import { AxiosError,AxiosResponse } from "axios"
import { JSONContent } from "@tiptap/react"
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
