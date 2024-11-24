import { useNavigate } from "react-router-dom"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface ApplicantCardProps {
  Name: string;
  Profile: string;
  email: string;
  skills: string[];
  status: string;
  applicantId: string;  
  onStatusChange: (applicantId: string, newStatus: string) => void; 
  bulkUpdate:string[];
  handleBulkUpdate:(checked:boolean,applicantId:string)=>void;
  bulkUpdateStatus:boolean
}

export function ApplicantCard({
  Name,
  Profile,
  email,
  skills,
  status,
  applicantId,
  onStatusChange,
  bulkUpdate,
  handleBulkUpdate,
  bulkUpdateStatus
}: ApplicantCardProps) {
  console.log(status)
  const navigate = useNavigate();
  const parsedSkills = skills.length ? JSON.parse(skills.toString()).slice(0, 3) : skills;

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(applicantId, newStatus);
  };

  return (
    <div className="rounded-2xl bg-zinc-950/85 max-w-5xl mx-auto md:flex sm:justify-between space-y-4 md:space-y-0 px-4 py-6 hover:bg-neutral-900/90 transition-colors cursor-pointer duration-300 antialiased"
      onClick={() => navigate(`/${Name}`)}
    >
      <div
        className="md:flex md:space-x-3 space-y-4 md:space-y-0"
      >
        <div className="md:flex md:space-x-3 space-y-4 md:space-y-0">
          <div>
            <img src={Profile} alt="" className="h-12 w-12 rounded-full" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white break-words">{Name}</h2>
            <p className="text-white break-words">{email}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center flex-wrap gap-1 md:justify-center">
        {parsedSkills.length && parsedSkills.map((item: any, index: any) => (
          <div
            key={index}
            className="px-2 text-white py-1 bg-zinc-800 rounded-full"
          >
            {item}
          </div>
        ))}
      </div>
      <div className={bulkUpdateStatus ? "block content-center items-center ": "hidden"} onClick={(e)=>e.stopPropagation()}>
        <Checkbox className= 'border-white'  checked={bulkUpdate.includes(applicantId)} onCheckedChange={(isChecked)=>{
          let checked = isChecked as boolean
          handleBulkUpdate(checked,applicantId)
        }}/>
      </div>
      <div className="flex items-center">
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full bg-neutral-800/50 h-fit text-white transition border-none">
            <SelectValue className="focus:outline-none" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 text-white border-none shadow-lg">
            <SelectItem value="Applied">Applied</SelectItem>
            <SelectItem value="Under Review">Under Review</SelectItem>
            <SelectItem value="Interviewed">Interviewed</SelectItem>
            <SelectItem value="Hired">Hired</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}


