export interface CreateApplications{
  JobTitle:string,
  Category:string,
  WorkMode:string,
  Type:string,
  MinSalary:number,
  MaxSalary:number,
  Location?:string,
  ApplicationLink:string,
  JobDescription:[{}],
  CompanyLogo:File | string,
  CompanyName:string,
  CompanyEmail:string,
  CompanyBio:[{}]
}

