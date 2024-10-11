import { ApplicantCard } from "@/components/ApplicantCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/utils/AxioApi";
import { toast } from 'react-hot-toast';
import { CustomAxiosError } from "@/types/type";

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

  const fetchApplicants = async () => {
    try {
      const response = await api.get("/applicant/getapplicants", {
        params: { JobLink }
      });

      console.log(response.data.Data)
      setApplied(response.data.Data.Applicants);
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
    try {
      await api.patch("/applicant/updatestatus", {
        JobLink,
        applicantId,
        newStatus
      });
      
      
      setApplied(prev => prev.map(app => 
        app.ApplicantsID._id === applicantId ? { ...app, status: newStatus } : app
      ));
      
      toast.success("Status updated successfully");
    } catch (error) {
      const axiosError = error as CustomAxiosError;
      if (axiosError.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Failed to update status");
      }
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [JobLink]);

  return (
    <div className="p-4">
      <h2 className="text-white font-semibold text-2xl sm:text-3xl text-center antialiased text-pretty text mb-4">
        {applied.length} Applicant for {JobLink}.
      </h2>
      {applied.map((app) => (
        <ApplicantCard
          key={app._id}
          applicantId={app.ApplicantsID._id}
          Name={app.ApplicantsID.Name}
          email={app.ApplicantsID.email}
          skills={app.ApplicantsID.skills}
          Profile={app.ApplicantsID.Profile}
          status={app.status}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
}