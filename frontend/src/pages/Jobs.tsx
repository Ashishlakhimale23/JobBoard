import { HomeJobCard } from "../components/HomeJobCard"
import { api } from "@/utils/AxioApi";
import { useState,useEffect,useCallback } from "react";
import debounce from "lodash.debounce"
import { useSetRecoilState } from "recoil";
import { UserProfile } from "@/store/atom";
import { JobApplication } from "@/types/type";
import { CardSkeleton } from "@/components/CardSkeleton";

export function Jobs() {
  enum Jobs {
    remote = "remote",
    fullTime = "fulltime",
    hybrid = "hybrid",
    internship = "internship",
    jobs = "jobs",
    recent = "recent",
  }

  const [search, setSearch] = useState("");
  const [allApplications, setAllApplications] = useState<JobApplication[]>([]);
  const [selectedJobType, setSelectedJobType] = useState<Jobs>(Jobs.jobs);
  const [searchpost, setSearchpost] = useState<JobApplication[]>([]);
  const setUserProfile = useSetRecoilState(UserProfile);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getAllApplications = async (
    jobType: Jobs
  ): Promise<{
    Data: JobApplication[];
    Profile: { Profile: string; Name: string };
  }> => {
    try {
      setIsLoading(true);
      const response = await api.get(`/applicant/getallapplication${jobType}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return { Data: [], Profile: { Profile: "", Name: "" } };
    } finally {
      setIsLoading(false);
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
    return () => {
      debouncedSearch.cancel();
    };
  }, [search, debouncedSearch]);

  useEffect(() => {
    const fetchApplications = async () => {
      const result = await getAllApplications(selectedJobType);
      setAllApplications(result.Data);
      setUserProfile((prev) => ({
        ...prev,
        Profile: result.Profile.Profile,
        Name: result.Profile.Name,
      }));
      localStorage.setItem("profile", JSON.stringify(result.Profile));
    };

    fetchApplications();
  }, [selectedJobType]);

  const renderJobTypeButton = (type: Jobs, label: string) => (
    <button
      className={`${
        selectedJobType === type
          ? "bg-white text-black hover:text-white"
          : "bg-neutral-900"
      } px-4 py-2 font-semibold rounded-full hover:bg-zinc-800`}
      onClick={() => setSelectedJobType(type)}
    >
      {label}
    </button>
  );

  const JobList = ({ jobs }: { jobs: JobApplication[] }) => (
    <>
      {jobs.map((app, index) => (
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
      ))}
    </>
  );

  

  return (
    <div className="text-white w-full min-h-screen px-4 mx-auto pb-8 max-w-7xl">
      <div className="w-full mx-auto max-w-3xl py-12 sm:py-20">
        <div className="w-full text-center space-y-9">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Find a job of your dreams.
          </h1>
          <input
            type="text"
            placeholder="Search by title."
            className="outline-none w-full lg:max-w-2xl text-white rounded-xl py-6 px-2 placeholder:text-white placeholder:font-semibold bg-neutral-900/90 focus:ring-2 focus:ring-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-center flex-wrap gap-2 mx-auto mb-8">
        {renderJobTypeButton(Jobs.recent, "Most Recent")}
        {renderJobTypeButton(Jobs.fullTime, "Full Time")}
        {renderJobTypeButton(Jobs.remote, "Remote")}
        {renderJobTypeButton(Jobs.hybrid, "Hybrid")}
        {renderJobTypeButton(Jobs.internship, "Internships")}
        {renderJobTypeButton(Jobs.jobs, "Jobs")}
      </div>

      <div className="space-y-2">
        {isLoading ? (<CardSkeleton/>):allApplications.length === 0 && !isLoading ? (
          <div className="rounded-2xl bg-zinc-950/85 sm:flex sm:justify-center text-lg font-semibold space-y-4 sm:space-y-0 px-4 py-6 hover:bg-neutral-900/90 transition-colors duration-300 antialiased">
            {selectedJobType === "jobs" || selectedJobType === "internship"
              ? `No ${selectedJobType} available`
              : `No ${selectedJobType} jobs available`}
          </div>
        ) : (
          <JobList jobs={search.length ? searchpost : allApplications} />
        )}
      </div>
    </div>
  );
}
