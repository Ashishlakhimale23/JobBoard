import { api } from "@/utils/AxioApi"
import { useNavigate, useParams } from "react-router-dom"
import {toast} from "react-hot-toast"
import { CreateApplications } from "@/types/type"
import { Application, ConformationModalState, CreateApplicationDefault, ShareModalState } from "@/store/atom"
import { useEffect, useState } from "react"
import { ConformationModal } from "@/components/ConformationModal"
import {TiptapEditor} from "@/components/ParseTipTapData" 
import { useRecoilState, useSetRecoilState } from "recoil"
import { UserProfileSkeleton } from "@/components/UserProfileSkeleton"
import { Edit,Share2} from "lucide-react"
import { ShareModal } from "@/components/ShareModal"
export function JobInfo(){
  const { jobLink } = useParams();
  const [conformationmodal,setConformationmodal] = useRecoilState(ConformationModalState)
  const [job, setJob] = useState<CreateApplications>(CreateApplicationDefault);
  const setApplication = useSetRecoilState(Application)
  const [displaybutton,setDisplaybutton] = useState<boolean>(false);
  const [admin,setAdmin] = useState<boolean>(false);
  const [isLoading,setIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  const [shareModal,setShareModal] = useRecoilState(ShareModalState)

  const getjob = async (): Promise<{Data:CreateApplications,applybutton:boolean,admin:boolean}> => {
    try {
      const response = await api.get("/applicant/particularjob", {
        params: { jobLink: jobLink },
      });
      return response.data;
    } catch (error) {
      console.log(error)
      toast.error("Could'nt fetch the job.");
      return {Data:CreateApplicationDefault,applybutton:false,admin:false};
    }
  };

  useEffect(() => {

    const fetchjob = async () => {
      const response = await getjob();
      setJob(response.Data);
      setJob((prev) => ({
        ...prev,
        CompanyOverview: JSON.parse(response.Data.CompanyOverview[0]),
      }));
      setJob((prev) => ({
        ...prev,
        Responsibilities: JSON.parse(response.Data.Responsibilities[0]),
      }));
      setJob((prev) => ({
        ...prev,
        Qualification: JSON.parse(response.Data.Qualification![0]),
      }));

      setDisplaybutton(response.applybutton);
      setAdmin(response.admin)
      setIsLoading(false)
    };
    fetchjob();

  },[]);

  if(isLoading && job === CreateApplicationDefault){
    return (
      <UserProfileSkeleton/>
    )
  }
  return (
    <>
      <div className="sm:max-w-4xl sm:mx-auto space-y-4 p-3">
        <header className="space-y-4 pb-6">
          <div className="rounded-2xl  antialiased">
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={job.CompanyLogo as string}
                  alt="company logo"
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
                  {job.Location} / {job.Type} / {job.WorkMode} /{" "}
                  {job.CompanyName}
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
          <div className="flex justify-center gap-2">
            <button className={`text-white font-semibold px-3 py-2 rounded-md bg-zinc-700/50 hover:bg-zinc-700 transition-colors ${displaybutton ? 'hidden' : 'block'} `}
            onClick={()=>{
              if(job.ApplicationLink){
                location.href = job.ApplicationLink;
              }
              setConformationmodal(true)
            }}>
              Apply for this job
            </button>
           <button className={`text-white flex items-center gap-2 font-semibold px-3 py-2 rounded-md bg-zinc-700/50 hover:bg-zinc-700 transition-colors  ${!admin ? 'hidden' : 'block'} `}
            onClick={()=>{
              setApplication(job)
              navigate('/createpost')
              
            }}>
              <Edit size={16}/>
              <span>Edit</span>
            </button>
          <button className={`text-white flex items-center gap-2 font-semibold px-3 py-2 rounded-md bg-zinc-700/50 hover:bg-zinc-700 transition-colors  `}
            onClick={()=>{
              setShareModal(true)
            }}>
              <Share2 size={16}/>
              <span>Share</span>
            </button>
          </div>
        </header>

        <div>
          <div>
           {job.CompanyOverview.content?.length && 
           <> 
           <p className="font-semibold text-white text-xl">Overview</p>
            <div className="p-4">
              <TiptapEditor initialContent={job.CompanyOverview} />
            </div> 
            </>
          }
            
          </div>
          <div>
            {
              job.CompanyOverview.content?.length && <>
            <p className="font-semibold text-white text-xl">Responsibilities</p>
            <div className="p-4">
              <TiptapEditor initialContent={job.Responsibilities} />
            </div>
              </>
            }
            
          </div>
          <div>
            {job.Qualification?.content?.length && <>
            <p className="font-semibold text-white text-xl">Qualification</p>
            <div className="p-4">
              <TiptapEditor initialContent={job.Qualification} />
            </div>
            </>
            }
          </div>
        </div>
      </div>

      <div
        className={`${
          conformationmodal ? "top-0" : "top-full"
        } fixed px-2 w-full h-screen flex justify-center items-center sm:px-10`}
      >
        <ConformationModal joblink={jobLink as string}/>
      </div>

      <div
        className={`${
          shareModal ? "top-0" : "top-full"
        } fixed px-2 w-full h-screen flex justify-center items-center sm:px-10`}
      >
        <ShareModal CompanyName={job.CompanyName} JobTitle={job.JobTitle}/>
      </div>

    </>

  );
}