import { HomeJobCard } from "../components/HomeJobCard"
import { api } from "@/utils/AxioApi";
import { useState,useEffect,useCallback } from "react";
import debounce from "lodash.debounce"

export function Jobs(){
  
 interface JobApplication {
  JobTitle: string;
  WorkMode: string;
  Type: string;
  AverageSalary: number;
  CompanyLogo: string;
  Location: string;
  JobLink:string
}

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

  const getAllApplications = async (jobType: Jobs): Promise<JobApplication[]> => {
    try {
      const response = await api.get(`/applicant/getallapplication${jobType}`);
      return response.data.Data;
    } catch (error) {
      return [];
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
      setAllApplications(result);
    };
    fetchApplications();
  }, [selectedJobType]);

    
  return (
    <>
      <div className=" text-white w-full min-h-screen px-4 mx-auto pb-8 max-w-7xl">
        <div className="w-full mx-auto max-w-3xl py-20 sm:py-28">
          <div className="w-full text-center space-y-9">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Find a job of your dreams.
            </h1>
            <input
              type="text"
              placeholder="Search by title."
              className="outline-none w-full lg:max-w-2xl text-white rounded-xl py-6 px-2 placeholder:text-white bg-neutral-900/90 focus:ring-2 focus:ring-white "
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
            !search.length ? allApplications.map((app,index)=>(
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

            :

          searchpost.map((app,index)=>(
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


          }
          
          
        </div>
      </div>
    </>
  );
}