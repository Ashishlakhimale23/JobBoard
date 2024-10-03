import {  educationdefault, UserProfile, UserProfileDefault, workExperienceDefault} from "@/store/atom";
import {TextEditor} from "./TextEditor"
import { useRecoilState } from "recoil";
import { JSONContent } from "@tiptap/react";
import { useEffect} from "react";
import { CustomAxiosError, UsersProfile} from "@/types/type";
import toast from "react-hot-toast";
import { api } from "@/utils/AxioApi";
import zod from "zod"

export function ProfileInfo(){
  const [userprofile, setUserprofile] = useRecoilState(UserProfile);
  const {
    Name,
    Profile,
    AboutMe,
    skills,
    Linkedin,
    twitter,
    workExperience,
    education,
  } = userprofile;

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

  const handleAddEducation = () => {
    const array = [...education,educationdefault];
    setUserprofile((prev) => ({ ...prev, education: array }));
  };

  const handleAddWork = () => {
    const array = [...workExperience, workExperienceDefault];
    setUserprofile((prev) => ({ ...prev, workExperience: array }));
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
    if (!Profile) {
      return toast.error("Fill the field.");
    }
    if (!AboutMe) {
      return toast.error("Fill the field.");
    }
    if (!Linkedin) {
      return toast.error("Fill the field company name.");
    }
    if (!twitter) {
      return toast.error("Fill the field company email.");
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
      return toast.success(response.data.message);
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

  useEffect(() => {
    localStorage.setItem("application", JSON.stringify(userprofile));
  }, [handleInputChange]);

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