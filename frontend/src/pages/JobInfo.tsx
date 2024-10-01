import { api } from "@/utils/AxioApi"
import { useParams } from "react-router-dom"
import {toast} from "react-hot-toast"
import { CreateApplications } from "@/types/type"
import { CreateApplicationDefault } from "@/store/atom"
import { useEffect, useState } from "react"

import {TiptapEditor} from "@/components/ParseTipTapData" 
export function JobInfo(){
    
    const {jobLink} = useParams()
    console.log(jobLink)
    const [job,setJob] = useState<CreateApplications>(CreateApplicationDefault);
    const getjob=async():Promise<CreateApplications>=>{
    try{
        const response = await api.get('/applicant/particularjob',{params:{jobLink:jobLink}})
        return response.data.Data;
    }catch(error){
        toast.error("Could'nt fetch the job.")
        return CreateApplicationDefault 
    }
    }

    useEffect(()=>{
        const fetchjob=async()=>{
            const response = await getjob();
            console.log(response)
            setJob(response)
            setJob((prev)=>({...prev,CompanyOverview:JSON.parse(response.CompanyOverview[0])}))
            setJob((prev)=>({...prev,Responsibilities:JSON.parse(response.Responsibilities[0])}))
            setJob((prev)=>({...prev,Qualification:JSON.parse(response.Qualification![0])}))
           
        } 
        fetchjob();
    },[])
    return (
      <>
        <div className="sm:max-w-4xl sm:mx-auto space-y-4 p-3">
          <header className=" ">
            <div className="rounded-2xl  antialiased">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={job.CompanyLogo as string}
                    alt=""
                    className="h-16  w-16 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white text-center">
                    {job.JobTitle}
                  </h2>
                  <p
                    className={`${
                      !job.Location ? "hidden " : "text-gray-400 text-center"
                    }`}
                  >
                    {job.Location} / {job.Type} / {job.WorkMode} / {job.CompanyName}
                  </p>
                  <p
                    className={`${
                      job.Location ? "hidden" : "text-gray-400 text-center"
                    }`}
                  >
                    {`${job.Type} / ${job.WorkMode} / ${job.CompanyName}`}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="flex justify-center">
            <button className="text-black font-semibold px-4 py-2 rounded-full bg-white ">Apply for this job</button>
          </div>

          <div>
            <div>
                <p className="font-semibold text-white text-xl">Overview</p>
                <TiptapEditor initialContent={job.CompanyOverview} />
            </div>
            <div>
                <p className="font-semibold text-white text-xl">Responsibilities</p>
                <TiptapEditor initialContent={job.Responsibilities} />
            </div>
            <div>
                <p className="font-semibold text-white text-xl">Qualification</p>
                <TiptapEditor initialContent={job.Qualification} />
            </div>
          </div>
        </div>
      </>
    );

}