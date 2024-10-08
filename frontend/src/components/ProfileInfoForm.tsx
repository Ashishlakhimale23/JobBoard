import {  educationdefault, projectdefault, UserProfile, UserProfileDefault, workExperienceDefault} from "@/store/atom";
import {TextEditor} from "./TextEditor"
import { useRecoilState } from "recoil";
import { JSONContent } from "@tiptap/react";
import { useEffect, useState} from "react";
import { CustomAxiosError, UsersProfile} from "@/types/type";
import toast from "react-hot-toast";
import { api } from "@/utils/AxioApi";
import zod from "zod"
import { useNavigate } from "react-router-dom";
import techStack from "@/utils/suggestions";

export function ProfileInfo(){
  const [userprofile, setUserprofile] = useRecoilState(UserProfile);
  const [skill,setSkill] = useState<string>("");
   const [predicated, setPredicated] = useState<string[]>([]);
  let {
    Name,
    Profile,
    Protfolio,
    AboutMe,
    skills,
    Linkedin,
    twitter,
    workExperience,
    education,
    Projects
  } = userprofile;
  const navigate =useNavigate() 

  useEffect(()=>{

    const fetchuser=async()=>{

    let userdata = localStorage.getItem("userprofile") 
    console.log(userdata)
    let userdataparsed = userdata ? JSON.parse(userdata) : null 
    if(userdataparsed === null){
      const result= await api.get("/applicant/getuser");
    const updatedProfile = {
      ...result.data.Data,
      AboutMe: result.data.Data.AboutMe.length
        ? JSON.parse(result.data.Data.AboutMe[0])
        : result.data.Data.AboutMe,
      skills: result.data.Data.skills.length
        ? JSON.parse(result.data.Data.skills[0])
        : result.data.Data.skills,
      workExperience: result.data.Data.workExperience.length
        ? JSON.parse(result.data.Data.workExperience[0].toString())
        : result.data.Data.workExperience,
      education: result.data.Data.education.length
        ? JSON.parse(result.data.Data.education[0].toString())
        : result.data.Data.education,
    };
    setUserprofile(updatedProfile);
    }else{
    setUserprofile(userdataparsed);
    }
    }
    fetchuser();
    console.log(userprofile)
  },[])
  const handleInputChange = (field: keyof typeof userprofile, value: any) => {
    setUserprofile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWorkExperienceChange=(field:keyof typeof workExperienceDefault,value:string )=>{
    const len = workExperience.length - 1;
    const work = {...workExperience[len],[field]:value}
    const array = [...workExperience.slice(0,len),work]
    setUserprofile((prev)=>({...prev,workExperience:array}))
  }

  const handleEducationChange=(field:keyof typeof educationdefault,value:string)=>{
    const len = education.length - 1;
    const work = {...education[len],[field]:value}
    const array = [...education.slice(0,len),work]
    setUserprofile((prev)=>({...prev,education:array}))
 }

const handleProjectChanges=(field:keyof typeof projectdefault,value:string)=>{
    const len = Projects.length - 1;
    const work = {...Projects[len],[field]:value}
    const array = [...Projects.slice(0,len),work]
    setUserprofile((prev)=>({...prev,Projects:array}))
 }

  const handleAddEducation = () => {
    const array = [...education,educationdefault];
    setUserprofile((prev) => ({ ...prev, education: array }));
  };

  const handleAddWork = () => {
    const array = [...workExperience, workExperienceDefault];
    setUserprofile((prev) => ({ ...prev, workExperience: array }));
  };

 const handleAddProject= () => {
    const array = [...Projects,projectdefault];
    setUserprofile((prev) => ({ ...prev,Projects: array }));
  };

  const CreateFormData = () => {
    const formData = new FormData() as FormData & UsersProfile;
    Object.entries(userprofile).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value instanceof Object) {
        formData.append(key, JSON.stringify(value));
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      }else {
        formData.append(key, value.toString());
      }
    });
    return formData;
  };

  const ZodObject = zod.object({
  Name: zod.string({ message: "Requires a string" }),
  Linkedin: zod
    .string()
    .regex(/^https:\/\/linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/, {
      message: "Must be a valid LinkedIn link",
    }),
  twitter: zod
    .string()
    .regex(/^https:\/\/(x\.com|twitter\.com)\/[A-Za-z0-9_]+\/?$/, {
      message: "Must be a valid Twitter link",
    }),
  Profile: zod
    .string()
    .nullable()
    .or(
      zod
        .instanceof(File)
        .refine(
          (file) => !file || file.size <= 1024 * 1024 * 3, 
          { message: "File size must be less than 3MB" }
        )
        .refine(
          (file) => {
            const ACCEPTED_FILE_TYPES = ["image/png", "image/jpg", "image/jpeg"];
            return !file || ACCEPTED_FILE_TYPES.includes(file.type);
          },
          { message: "File must be a PNG, JPG, or JPEG" }
        )
    ),
});


const VerifyZodObject = (data: any) => {
  const result = ZodObject.safeParse(data);
  return result;
};

  const handleSubmit = async () => {
    if (!Name) {
      return toast.error("Fill the field Job title.");
    }
    if (!AboutMe) {
      return toast.error("Fill the field Aboutme.");
    }
    if (!Linkedin) {
      return toast.error("Fill the field Linkedin url.");
    }
    if (!twitter) {
      return toast.error("Fill the field twitter url.");
    }

     const ParsedResult = VerifyZodObject(userprofile);
     if(!ParsedResult.success){
      const problem:string= ParsedResult.error.issues[0].message
      console.log(ParsedResult)
          return toast.error(problem)
    }

    const toastid = toast.loading("Submitting...");
    try {
      const formdata = CreateFormData();
      const response = await api.post(
        "/applicant/editprofile",
        formdata,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUserprofile(UserProfileDefault);
      toast.success(response.data.message);
      navigate(`/${userprofile.Name}`)
      
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
    } finally {
      toast.dismiss(toastid);
    }
  };

  const updateAboutme = (content: JSONContent) => {
    setUserprofile((prev) => ({ ...prev, AboutMe: content }));
  };

  const updateAboutmeEducation=(content:JSONContent)=>{
    const len = education.length - 1;
    const work = {...education[len],AboutCourse:content}
    const array = [...education.slice(0,len),work]
    setUserprofile((prev)=>({...prev,education:array}))
  }


  const updateAboutmeExperience=(content:JSONContent)=>{
    const len = workExperience.length - 1;
    const work = {...workExperience[len],AboutJob:content}
    const array = [...workExperience.slice(0,len),work]
    setUserprofile((prev)=>({...prev,workExperience:array}))
  }

  const updateAboutmeProject=(content:JSONContent)=>{
    const len = Projects.length - 1;
    const work = {...Projects[len],AboutProject:content}
    const array = [...Projects.slice(0,len),work]
    setUserprofile((prev)=>({...prev,Projects:array}))
  }

const getpredicatedvalue = (value:string) => {
    const flitered = techStack.filter(
      (item:string) => item.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    console.log(flitered)
    setPredicated(flitered.slice(0,5));
  };

  const handletechstack = (e:any) => {
    setSkill(e.target.value);
    getpredicatedvalue(e.target.value);
  };

  const handleOnClickOnTechstack = (e:any) => {
    
    setUserprofile((prevInfo) => ({
       ...prevInfo,
       skills: prevInfo.skills ? [...prevInfo.skills, e.target.innerText] : [e.target.innerText]
   }))
   
      setSkill("");
  };

  const handleOnClickDeleteTech = (e:any) => {
    const updatedarray = skills.filter(
      (item:string) => item != e.currentTarget.parentElement.firstChild.innerText
    );
    setUserprofile((prevInfo) => ({ ...prevInfo, skills: updatedarray }));
  };

  const handleKeyDownTechstack = (e:any) => {
    if (e.code == "Enter" && skill.length  ) {
      
         setUserprofile((prevInfo) => ({
       ...prevInfo,
       skills: prevInfo.skills ? [...prevInfo.skills, e.target.value] : [e.target.value]
   }));
      setSkill("");
    }
  };
    

  return (
    <>
      <div className="min-h-screen bg-black">
        <div className="px-4 py-12 text-white max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-white">
            User Info
          </h1>
          <div className="space-y-8 bg-neutral-900/50 sm:p-8 p-2 rounded-lg backdrop-blur-sm">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                Job Information
              </h2>

              <div>
                <label
                  htmlFor="Name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Name
                </label>
                <input
                  id="Name"
                  autoComplete="off"
                  type="text"
                  className="w-full appearance-none bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={Name}
                  onChange={(e) => handleInputChange("Name",e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="Profile"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Profiles
                </label>
                <input
                  id="Profile"
                  type="file"
                  className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    handleInputChange("Profile",file);
                  }}
                />
              </div>

              <div className="relative">
                 <label htmlFor="Skills" className="font-medium block text-sm text-gray-300 mb-1">Skills</label>
                <input
                  id="Skills"
                  className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2  focus:ring-blue-500 transition "
                  placeholder="Search for technologies, topics,more..."
                  value={skill}
                  onChange={handletechstack}
                  onKeyDown={handleKeyDownTechstack}
                />
                <div className={`${!skill.length || !predicated.length?'hidden':'bg-neutral-800 gap-2 mt-2 absolute h-fit rounded-md space-y-2 py-2 z-10 w-full'}`}>
                  {!skill.length || !predicated.length
                    ? null
                    :predicated.map((tech, index) => (
                        <div
                          key={index}
                          className=" hover:bg-white  cursor-pointer hover:text-black rounded-sm mx-2  px-4 py-1"
                          onClick={handleOnClickOnTechstack}
                        >{tech}</div>
                      ))}
                </div>

                <div className="flex flex-wrap mt-2 gap-1">
                  {!skills
                    ? null
                    : skills.map((tech, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-zinc-800 px-2 py-1 cursor-pointer rounded-2xl  "
                        >
                          <p>{tech} </p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="h-5 ml-1 "
                            onClick={handleOnClickDeleteTech}
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6 18 18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                      ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-300">Bio</label>
                <TextEditor initialContent={AboutMe} onUpdate={updateAboutme} />
              </div>

              <div>
                <label
                  htmlFor="Linkedin"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Linkedin URL
                </label>
                <input
                  id="Linkedin"
                  type="text"
                  className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={Linkedin}
                  autoComplete="off"
                  onChange={(e) =>
                    handleInputChange("Linkedin",e.target.value)
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="Twitter"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Twitter URL
                </label>
                <input
                  id="Twitter"
                  type="text"
                  className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={twitter}
                  autoComplete="off"
                  onChange={(e) => handleInputChange("twitter",e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="Portfolio"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Portfolio
                </label>
                <input
                  id="Portfolio"
                  type="text"
                  className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={Protfolio}
                  autoComplete="off"
                  onChange={(e) => handleInputChange("Protfolio",e.target.value)}
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-white">
              Work Experience
            </h2>

            <div className="space-y-4">
              {workExperience.map((work,index) => (
                <>
                  <div key={index}>
                    <label
                      htmlFor="CompanyName"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Company Name
                    </label>
                    <input
                      id="CompanyName"
                      autoComplete="off"
                      type="text"
                      className="w-full appearance-none bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={work.CompanyName}
                      onChange={(e) =>
                        handleWorkExperienceChange("CompanyName", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="Role"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Role
                    </label>
                    <input
                      id="Role"
                      type="text"
                      className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={work.Role}
                      autoComplete="off"
                      onChange={(e) =>
                        handleWorkExperienceChange("Role", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="Location"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Location
                    </label>
                    <input
                      id="Location"
                      type="text"
                      className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={work.Location}
                      autoComplete="off"
                      onChange={(e) =>
                        handleWorkExperienceChange("Location", e.target.value)
                      }
                    />
                  </div>

                  <div className="sm:flex w-full gap-2">
                    <div className="flex-1">
                      <label
                        htmlFor="JoiningYear"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Joining Year
                      </label>
                      <input
                        id="JoiningYear"
                        type="text"
                        className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={work.JoiningYear}
                      onChange={(e) =>
                        handleWorkExperienceChange("JoiningYear", e.target.value)
                      }
                      />
                    </div>

                    <div className="flex-1">
                      <label
                        htmlFor="LeavingYear"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Leaving Year
                      </label>
                      <input
                      id="LeavingYear"
                        type="text"
                        className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={work.LeavingYear}
                      onChange={(e) =>
                        handleWorkExperienceChange("LeavingYear", e.target.value)
                      }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-300">
                      About Job
                    </label>
                    <TextEditor
                      initialContent={work.AboutJob}
                      onUpdate={updateAboutmeExperience}
                    />
                  </div>
                </>
              ))}
            </div>
            <div className="flex justify-start">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition"
                onClick={handleAddWork}
              >
                Add Work Experience
              </button>
            </div>
            <h2 className="text-xl font-semibold text-white">Education</h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <>
                  <div key={index}>
                    <label
                      htmlFor="UniversityName"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      University Name
                    </label>
                    <input
                      id="UniversityName"
                      autoComplete="off"
                      type="text"
                      className="w-full appearance-none bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={edu.UniversityName}
                      onChange={(e) =>
                        handleEducationChange("UniversityName", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="CourseName"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Course Name
                    </label>
                    <input
                      id="CourseName"
                      type="text"
                      className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={edu.CourseName}
                      autoComplete="off"
                      onChange={(e) =>
                        handleEducationChange("CourseName", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="UniLocation"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Location
                    </label>
                    <input
                      id="UniLocation"
                      type="text"
                      className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={edu.UniLocation}
                      autoComplete="off"
                      onChange={(e) =>
                        handleEducationChange("UniLocation", e.target.value)
                      }
                    />
                  </div>

                  <div className="sm:flex w-full gap-2">
                    <div className="flex-1">
                      <label
                        htmlFor="StartYear"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Start Year
                      </label>
                      <input
                        id="StartYear"
                        type="text"
                        className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={edu.StartYear}
                      onChange={(e) =>
                        handleEducationChange("StartYear", e.target.value)
                      }
                      />
                    </div>

                    <div className="flex-1">
                      <label
                        htmlFor="EndYear"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        End Year
                      </label>
                      <input
                        id="EndYear"
                        type="text"
                        className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={edu.EndYear}
                      onChange={(e) =>
                        handleEducationChange("EndYear", e.target.value)
                      }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-300">
                      About Course
                    </label>
                    <TextEditor
                      initialContent={edu.AboutCourse}
                      onUpdate={updateAboutmeEducation}
                    />
                  </div>
                </>
              ))}
            </div>
            <div className="flex justify-start">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition"
                onClick={handleAddEducation}
              >
                Add Education
              </button>
            </div>

            <h2 className="text-xl font-semibold text-white">Projects</h2>
            <div className="space-y-4">
              {Projects.map((edu, index) => (
                <>
                  <div key={index}>
                    <label
                      htmlFor="ProjectTitle"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                     Project Name 
                    </label>
                    <input
                      id="ProjectTitle"
                      autoComplete="off"
                      type="text"
                      className="w-full appearance-none bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={edu.Title}
                      onChange={(e) =>
                        handleProjectChanges("Title",e.target.value)
                      }
                    />
                  </div>

                  <div >
                    <label
                      htmlFor="ProjectGithublink"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                    Github Link 
                    </label>
                    <input
                      id="ProjectGithublink"
                      autoComplete="off"
                      type="text"
                      className="w-full appearance-none bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={edu.GithubLink}
                      onChange={(e) =>
                        handleProjectChanges("GithubLink",e.target.value)
                      }
                    />
                  </div>

                  <div >
                    <label
                      htmlFor="ProjectLiveLink"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                    Live Link 
                    </label>
                    <input
                      id="ProjectLiveLink"
                      autoComplete="off"
                      type="text"
                      className="w-full appearance-none bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={edu.LiveLink as string}
                      onChange={(e) =>
                        handleProjectChanges("LiveLink",e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-300">
                      About Project  
                    </label>
                    <TextEditor
                      initialContent={edu.AboutProject}
                      onUpdate={updateAboutmeProject}
                    />
                  </div>
                </>
              ))}
            </div>
            <div className="flex justify-start">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition"
                onClick={handleAddProject}
              >
                Add Project 
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition"
                onClick={handleSubmit}
              >
                Save Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}