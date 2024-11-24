import { ApplicantCard } from "@/components/ApplicantCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/utils/AxioApi";
import { toast } from 'react-hot-toast';
import { CustomAxiosError} from "@/types/type";
import { CardSkeleton } from "@/components/CardSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface Applicant {
  ApplicantsID: {
    _id:string,
    Name: string;
    Profile: string;
    skills: string[];
    email: string;
  };
  status: string;
  _id: string;
}

export function ShowApplicant() {
  const { JobLink } = useParams();
  const [applied, setApplied] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("Newsetfirst");
  const [status, setStatus] = useState<string>("All");
  const [updateStatus,setUpdateStatus] = useState('')
  const [bulkUpdate,setBulkUpdate] = useState<string[]>([])
  const [bulkUpdateStatus,setBulkUpdateStatus] = useState<boolean>(false)

  const fetchApplicants = async () => {
    try {
      const response = await api.get("/applicant/getapplicants", {
        params: { JobLink, filter, status },
      });
      setApplied(response.data.Data);
      setIsLoading(false);
    } catch (error) {
      if (error) {
        const axiosError = error as CustomAxiosError;
        if (axiosError.response?.data?.message) {
          toast.error(axiosError.response.data.message);
        } else {
          toast.error("An unexpected error occurred");
        }
      }
    }
  };

  const handleStatusChange = async (applicantId: string, newStatus: string) => {
    toast.loading("Updating...",{id:"update"})
    try {
      
      await api.patch("/applicant/updatestatus", {
        JobLink,
        applicantId,
        newStatus,
      });

      setApplied((prev) =>
        prev.map((app) =>
          app.ApplicantsID._id === applicantId
            ? { ...app, status: newStatus }
            : app
        )
      );

      toast.success("Status updated successfully");
    } catch (error) {
      const axiosError = error as CustomAxiosError;
      if (axiosError.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Failed to update status");
      }
    }finally{
      toast.dismiss('update')
    }
  };

  const updateAll = async()=>{
    toast.loading('Rejecting...',{id:"rejecting"})
    try{
      const result = await api.patch('/applicant/rejectall',{JobLink})
      if(result.status === 200){
         
        setApplied((prev)=>prev.map((app)=>app.status!='Hired'?{...app,status:'Rejected'}:app))
        return toast.success("Rejected all of the remaining")
      }
    }catch(error){
      const axiosError = error as CustomAxiosError;
      if (axiosError.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Failed to update status");
      }
    }finally{
      toast.dismiss("rejecting")
    }
  }

  const handlefilterChange = (newStatus: string) => {
    setFilter(newStatus);
  };

  const handleFilterStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleBulkUpdate = (checked:boolean,applicantId:string)=>{
    setBulkUpdate(checked ? [...bulkUpdate,applicantId]:bulkUpdate.filter((bulk)=>bulk!=applicantId))
    console.log(bulkUpdate)
  }

  const handleUpdateStatusChange = (newStatus: string) => {
    setUpdateStatus(newStatus);
  };

  

  const handleSumbitBulkUpdate =async()=>{
    toast.loading("Updating...",{id:'updating'})

    try{
      if(!bulkUpdate.length){
        return toast.error("Select some applicants.")
      }
      if(updateStatus.length == 0){
        return toast.error('Select the new status')
      }
      const result = await api.patch('/applicant/bulkupdate',{bulkUpdate,newStatus:updateStatus,JobLink})
      if(result.status==200){
        toast.dismiss('updating')
        setApplied((prev)=>prev.map((app)=>bulkUpdate.includes(app.ApplicantsID._id) ? {...app,status:updateStatus}:app))
        setBulkUpdateStatus(false)
        setUpdateStatus('')
        setBulkUpdate([])
        return toast.success("updated")
      }
    }catch(error){
    const axiosError = error as CustomAxiosError;
      if (axiosError.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else {
        console.log(error)
        toast.error("Failed to update status");
      }
    }finally{
      toast.dismiss("updating")

    }
  }

  useEffect(() => {
    fetchApplicants();
  }, [JobLink, filter, status]);

  if (isLoading) {
    return (
      <>
        <div className="w-full max-w-5xl mx-auto p-4">
          <CardSkeleton />
        </div>
      </>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-white font-semibold text-2xl sm:text-3xl text-center antialiased text-pretty text mb-4">
       {bulkUpdateStatus ? `Applicants selected ${bulkUpdate.length}`  : `Applicant for ${JobLink}`} 
      </h2>
      <div className="text-white max-w-5xl mx-auto p-4 flex sm:flex-row flex-col justify-between gap-2">
        <div className="flex-1">
          <span className="font-semibold text-lg">Filter By</span>
          <div className=" flex flex-col sm:flex-row p-2 rounded-md justify-between gap-2 bg-zinc-900">
            <div className="flex-1">
              <Select value={filter} onValueChange={handlefilterChange}>
                <SelectTrigger className="w-full bg-neutral-800/50 h-fit text-white transition border-none">
                  <SelectValue className="focus:outline-none" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 text-white border-none shadow-lg">
                  <SelectItem value="A-Z">A-Z</SelectItem>
                  <SelectItem value="Z-A">Z-A</SelectItem>
                  <SelectItem value="Newsetfirst">Newsetfirst</SelectItem>
                  <SelectItem value="Oldestfirst">Oldestfirst</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={status} onValueChange={handleFilterStatusChange}>
                <SelectTrigger className="w-full bg-neutral-800/50 h-fit text-white transition border-none">
                  <SelectValue className="focus:outline-none" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 text-white border-none shadow-lg">
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Interviewed">Interviewed</SelectItem>
                  <SelectItem value="Hired">Hired</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <span className="font-semibold text-lg">Update</span>
          <div className="flex flex-col sm:flex-row p-2 gap-2 rounded-md justify-between bg-zinc-900">
            <button className={bulkUpdateStatus ?"hidden": "block hover:bg-zinc-700 w-full text-sm bg-zinc-800 p-2 rounded-md"}
            onClick={updateAll}
            >
              Reject all of the remaining
            </button>
            <div className={bulkUpdateStatus ? "block w-full ": "hidden  "}>
              <Select value={updateStatus} onValueChange={handleUpdateStatusChange} >
                <SelectTrigger className="w-full bg-neutral-800/50 h-fit text-white transition border-none">
                  <SelectValue className="focus:outline-none"  placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 text-white border-none shadow-lg" >
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Interviewed">Interviewed</SelectItem>
                  <SelectItem value="Hired">Hired</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          <button className={bulkUpdateStatus ? "hidden" :"block hover:bg-zinc-700 text-sm w-full bg-zinc-800 p-2 rounded-md"}
          onClick={()=>setBulkUpdateStatus(!bulkUpdateStatus)}
            >
             Select and bulk update 
            </button>
          <button className={!bulkUpdateStatus ? "hidden" :"block hover:bg-zinc-700 text-sm w-full bg-zinc-800 p-2 rounded-md"}
          onClick={handleSumbitBulkUpdate}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {applied.length ? (
          applied.map((app) => (
            <ApplicantCard
              key={app._id}
              applicantId={app.ApplicantsID._id}
              Name={app.ApplicantsID.Name}
              email={app.ApplicantsID.email}
              skills={app.ApplicantsID.skills}
              Profile={app.ApplicantsID.Profile}
              status={app.status}
              onStatusChange={handleStatusChange}
              handleBulkUpdate={handleBulkUpdate}
              bulkUpdate={bulkUpdate}
              bulkUpdateStatus={bulkUpdateStatus}
            />
          ))
        ) : (
          <div className="rounded-2xl bg-zinc-950/85 mx-auto max-w-5xl text-white sm:flex sm:justify-center text-lg font-semibold space-y-4 sm:space-y-0 px-4 py-6 hover:bg-neutral-900/90 transition-colors duration-300 antialiased">
            {`No applicant with ${status} status `}
          </div>
        )}
      </div>
    </div>
  );
}