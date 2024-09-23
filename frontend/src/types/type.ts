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
  MinSalary:number,
  MaxSalary:number,
  Location?:string,
  ApplicationLink:string,
  JobDescription:JSONContent,
  CompanyLogo:File | string,
  CompanyName:string,
  CompanyEmail:string,
  CompanyBio:JSONContent
}
