import { HomeJobCard } from "../components/HomeJobCard"
import { api } from "@/utils/AxioApi";
import { useState,useEffect,useCallback } from "react";
import debounce from "lodash.debounce"
import { useSetRecoilState } from "recoil";
import { UserProfile } from "@/store/atom";
import { JobApplication } from "@/types/type";

export function Jobs(){
  
enum Jobs {
  remote = 'remote',
  fullTime = 'fulltime',
  hybrid = 'hybrid',
  internship = 'internship',
  jobs = 'jobs',
  recent = 'recent'
}

  const [search,setSearch] = useState('')
  const [allApplications, setAllApplications] = useState<JobApplication[]>([]);
  const [selectedJobType, setSelectedJobType] = useState<Jobs>(Jobs.jobs);
  const [searchpost,setSearchpost] = useState<JobApplication[]>([])
  const setUserProfile = useSetRecoilState(UserProfile)

  const getAllApplications = async (jobType: Jobs): Promise<{Data:JobApplication[],Profile:{Profile:string,Name:string}}> => {
    try {
      const response = await api.get(`/applicant/getallapplication${jobType}`);
      return response.data;
    } catch (error) {
      console.log(error)
      return {Data:[],Profile:{Profile:"",Name:""}};
    }
  };

const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      if (searchTerm === "") {
      setAllApplications(allApplications);

      } else {
        setSearchpost(
          allApplications?.filter((post) =>
            post.JobTitle.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
    }, 300),
    [allApplications]
  );

  useEffect(() => {
    debouncedSearch(search.trim());
    console.log(allApplications)
    return () => {
      debouncedSearch.cancel();
    };
  }, [search, debouncedSearch]);

  useEffect(() => {
    const fetchApplications = async () => {
      const result = await getAllApplications(selectedJobType);
      setAllApplications(result.Data);
      setUserProfile((prev)=>({...prev,Profile:result.Profile.Profile,Name:result.Profile.Name}))
      localStorage.setItem('profile',JSON.stringify(result.Profile))
    };
    fetchApplications();
  }, [selectedJobType]);

  return (
    <>
      <div className=" text-white w-full min-h-screen px-4 mx-auto pb-8 max-w-7xl">
        <div className="w-full mx-auto max-w-3xl py-12 sm:py-20">
          <div className="w-full text-center space-y-9">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Find a job of your dreams.
            </h1>
            <input
              type="text"
              placeholder="Search by title."
              className="outline-none w-full lg:max-w-2xl text-white rounded-xl py-6 px-2 placeholder:text-white placeholder:font-semibold bg-neutral-900/90 focus:ring-2 focus:ring-white "
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-center flex-wrap gap-2  mx-auto mb-8">
          <button 
          className={`${selectedJobType === 'recent'?'bg-white text-black hover:text-white px-4 py-2 font-semibold rounded-full hover:bg-zinc-800' :"bg-neutral-900 px-4 py-2 font-semibold rounded-full hover:bg-zinc-800" }`}
          onClick={()=>setSelectedJobType(Jobs.recent)}
          >
            Most Recent
          </button>
          <button 
          className={`${selectedJobType === 'fulltime'?'bg-white text-black hover:text-white px-4 py-2 font-semibold rounded-full hover:bg-zinc-800' :"bg-neutral-900 px-4 py-2 font-semibold rounded-full hover:bg-zinc-800" }`}
          onClick={()=>setSelectedJobType(Jobs.fullTime)}
          >
            Full time
          </button>
          <button 

          className={`${selectedJobType === 'remote'?'bg-white text-black hover:text-white px-4 py-2 font-semibold rounded-full hover:bg-zinc-800' :"bg-neutral-900 px-4 py-2 font-semibold rounded-full hover:bg-zinc-800" }`}
          onClick={()=>setSelectedJobType(Jobs.remote)}
          >
            Remote
          </button>
          <button 

          className={`${selectedJobType === 'hybrid'?'bg-white text-black hover:text-white px-4 py-2 font-semibold rounded-full hover:bg-zinc-800' :"bg-neutral-900 px-4 py-2 font-semibold rounded-full hover:bg-zinc-800" }`}
          onClick={()=>setSelectedJobType(Jobs.hybrid)}
          >
            Hybrid
          </button>
          <button 
          
          className={`${selectedJobType === 'internship'?'bg-white text-black hover:text-white px-4 py-2 font-semibold rounded-full hover:bg-zinc-800' :"bg-neutral-900 px-4 py-2 font-semibold rounded-full hover:bg-zinc-800" }`}
          onClick={()=>setSelectedJobType(Jobs.internship)}
          >
            Internships
          </button>
         <button 

          className={`${selectedJobType === 'jobs'?'bg-white text-black hover:text-white px-4 py-2 font-semibold rounded-full hover:bg-zinc-800' :"bg-neutral-900 px-4 py-2 font-semibold rounded-full hover:bg-zinc-800" }`}
          onClick={()=>setSelectedJobType(Jobs.jobs)}
          >
            Jobs
          </button>
        </div>

        <div className="space-y-2">

          {
  !allApplications.length ? (
    <div className="rounded-2xl bg-zinc-950/85 sm:flex sm:justify-center text-lg font-semibold space-y-4 sm:space-y-0  px-4 py-6  hover:bg-neutral-900/90 transition-colors duration-300 antialiased ">{selectedJobType ==="jobs" || selectedJobType === "internship" ?`No ${selectedJobType} available`:`No ${selectedJobType} jobs available`}</div>
  ) : (
    <>
      {!search.length ? (
        allApplications.map((app, index) => (
          <HomeJobCard
            key={index}
            Type={app.Type}
            JobTitle={app.JobTitle}
            AverageSalary={app.AverageSalary}
            Location={app.Location}
            WorkMode={app.WorkMode}
            CompanyLogo={app.CompanyLogo}
            JobLink={app.JobLink}
          />
        ))
      ) : (
        searchpost.map((app, index) => (
          <HomeJobCard
            key={index}
            Type={app.Type}
            JobLink={app.JobLink}
            JobTitle={app.JobTitle}
            AverageSalary={app.AverageSalary}
            Location={app.Location}
            WorkMode={app.WorkMode}
            CompanyLogo={app.CompanyLogo}
          />
        ))
      )}
    </>
  )
}

          
        </div>
      </div>
    </>
  );
}