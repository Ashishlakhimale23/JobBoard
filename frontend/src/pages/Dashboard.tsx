import { api } from "@/utils/AxioApi";
import { useCallback, useEffect, useState } from "react";
import { CustomAxiosError, JobApplication } from "@/types/type";
import {toast} from "react-hot-toast"
import { HomeJobCard } from "@/components/HomeJobCard";
import { useRecoilState } from "recoil";
import { OnTap } from "@/store/atom";
import { AppliedJobCard } from "@/components/AppliedJobCard";


export function Dashboard(){
  interface Application  {
    ApplicationID : JobApplication,
    status:string,
  } 
  const [onTap,setOnTap] = useRecoilState(OnTap);
  const [uploadedjobs, setUploadedjobs] = useState<JobApplication[]>([]);
  const [applied,setApplied] = useState<Application[]>([])
  const handleOnClickUpload = useCallback(async () => {
setOnTap("uploaded");
    try {
      const response = await api.get("/applicant/getjobuploaded");
      console.log(response)
      setUploadedjobs(response.data.Data.JobUploaded);

    } catch (error) {
      if (error) {
        const axiosError = error as CustomAxiosError;

        if (
          axiosError.response &&
          axiosError.response.data &&
          axiosError.response.data.message
        ) {
          return toast.error(axiosError.response.data.message);
        } else {
          return toast.error("An unexpected error occurred");
        }
      }
    }
  }, [onTap]);

    const handleOnClickApplied= useCallback(async () => {
        setOnTap('applied')
    try {
      const response = await api.get("/applicant/getappliedjobs");
      console.log(response.data)
      setApplied(response.data.Data.Application);
    } catch (error) {
      if (error) {
        const axiosError = error as CustomAxiosError;
        if (
          axiosError.response &&
          axiosError.response.data &&
          axiosError.response.data.message
        ) {
          return toast.error(axiosError.response.data.message);
        } else {
          return toast.error("An unexpected error occurred");
        }
      }
    }
  }, [onTap]);

 useEffect(()=>{
    
    handleOnClickUpload()

 },[])
  return (
    <>
      <section className="text-white">
        <div
          className={`text-white space-y-1 text-lg bg-zinc-900 rounded-md p-2 max-w-xl mx-auto 
                         md:space-y-0 md:space-x-2 md:flex md:justify-center `}
        >
          <button
            className={`block w-full  p-2 text-left md:text-center hover:bg-white hover:text-black rounded-md ${
              onTap == "uploaded" ? "bg-white text-black" : ""
            }`}
            onClick={() => {
              
              handleOnClickUpload();
            }}
          >
            Jobs Uploaded
          </button>
          <button
            className={`block w-full md:text-center  p-2 text-left hover:bg-white hover:text-black rounded-md ${
              onTap == "applied" ? "bg-white text-black" : ""
            }`}
            onClick={() => {
              handleOnClickApplied()
            }}
          >
            Applied for jobs
          </button>
        </div>
      </section>

        <div className="w-full max-w-5xl mx-auto p-4 space-y-3">
          {
          onTap === "uploaded" ? uploadedjobs.map((job, index) => (
            <HomeJobCard
              key={index}
              Type={job.Type}
              JobTitle={job.JobTitle}
              AverageSalary={job.AverageSalary}
              Location={job.Location}
              WorkMode={job.WorkMode}
              CompanyLogo={job.CompanyLogo}
              JobLink={job.JobLink}
            />
          )):
            applied && applied.map((job,index)=>(
              <AppliedJobCard
              key={index}
              Type={job.ApplicationID.Type}
              JobTitle={job.ApplicationID.JobTitle}
              AverageSalary={job.ApplicationID.AverageSalary}
              Location={job.ApplicationID.Location}
              WorkMode={job.ApplicationID.WorkMode}
              CompanyLogo={job.ApplicationID.CompanyLogo}
              JobLink={job.ApplicationID.JobLink}
              status={job.status}
               />
            ))
          }
        </div>
    </>
  );
}