import { Application, CreateApplicationDefault} from "@/store/atom";
import {TextEditor} from "./TextEditor"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRecoilState } from "recoil";
import { JSONContent } from "@tiptap/react";
import { useEffect } from "react";
import zod, {  ZodType } from "zod"
import { CreateApplications, CustomAxiosError} from "@/types/type";
import toast from "react-hot-toast";
import { api } from "@/utils/AxioApi";

export function CreateApplication(){
  
  const [createApplication, setCreateApplication] = useRecoilState(Application);
  const {
    JobTitle,
    Qualification,
    Responsibilities,
    Location,
    ApplicationLink,
    Type,
    AverageSalary,
    Category,
    WorkMode,
    CompanyName,
    CompanyEmail,
    CompanyOverview,
    CompanyLogo,
  } = createApplication;

  const handleInputChange = (
    field: keyof typeof createApplication,
    value: any
  ) => {
    setCreateApplication((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateJobDescription = (content: JSONContent) => {
    setCreateApplication((prev) => ({ ...prev, Responsibilities: content }));
  };

  const updateCompanyBio = (content: JSONContent) => {
    setCreateApplication((prev) => ({ ...prev, CompanyOverview: content }));
  };

  const updateQualification= (content: JSONContent) => {
    setCreateApplication((prev) => ({ ...prev, Qualification: content }));
  };

  const CreateFormData = () => {
    const formData = new FormData() as FormData & CreateApplications;
    Object.entries(createApplication).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      }
      else if(value instanceof Object){
        formData.append(key,JSON.stringify(value))
      } else {
        formData.append(key, value.toString());
      }
    });
    return formData;
  };



const ZodObject: ZodType<any> = zod.object({
  Category: zod.string({ message: "Requires a string" }),
  Type: zod.string({ message: "Requires a string" }),
  WorkMode: zod.string({ message: "Requires a string" }),
  Location: zod.string({ message: "Requires a string" }).optional(),
  JobTitle: zod.string({ message: "Requires a string" }),
  ApplicationLink: zod.string({ message: "Requires a string" }).optional(),
  CompanyName: zod.string({ message: "Requires a string" }),
  CompanyEmail: zod
    .string()
    .email()
    .refine((email) => email.endsWith("@gmail.com"), {
      message: "Must be a valid Gmail address",
    }),
  AverageSalary: zod.coerce.number({ message: "Give me some salary man" }),
 
  CompanyLogo: zod
    .string()
    .or(
      zod
        .instanceof(File)
        .refine((file) => {
          return !file || file.size <= 1024 * 1024 * 3; // 3MB limit (Update this according to your needs)
        }, "File size must be less than 3MB")
        .refine((file) => {
          const ACCEPTED_FILE_TYPES = ['image/png']; // Ensure this is defined
          return ACCEPTED_FILE_TYPES.includes(file.type);
        }, "File must be a PNG")
    ),
});


const VerifyZodObject = (data: any) => {
  const result = ZodObject.safeParse(data);
  return result;
};
  const handleSubmit = async () => {
    console.log(createApplication);
    if (!JobTitle) {
      return toast.error("Fill the field Job title.");
    }
    if (!Category) {
      return toast.error("Fill the field.");
    }
    if (!Type) {
      return toast.error("Fill the field.");
    }
    if (!WorkMode) {
      return toast.error("Fill the field.");
    }
    if (!CompanyName) {
      return toast.error("Fill the field company name.");
    }
    if (!CompanyEmail) {
      return toast.error("Fill the field company email.");
    }
    if (!CompanyOverview) {
      return toast.error("Fill the field company bio.");
    }
    if (!Responsibilities) {
      return toast.error("Fill the field job description.");
    }
    if (!CompanyLogo) {
      return toast.error("Fill the company logo.");
    }
    if(!Location && WorkMode!="Remote"){
      return toast.error("Fill the location field.")
    }
    if (!AverageSalary) {
      return toast.error("Fill the max salary.");
    }
    

    const ParsedResult = VerifyZodObject(createApplication);
     if(!ParsedResult.success){
      const problem:string= ParsedResult.error.issues[0].message
      console.log(ParsedResult)
          return toast.error(problem)
    }

    const toastid = toast.loading("Submitting...")
    try {
      const formdata = CreateFormData();
      const response = await api.post(
        "/applicant/createapplication",
        formdata,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setCreateApplication(CreateApplicationDefault)
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
    }finally{
      toast.dismiss(toastid)
    }
  };

  useEffect(() => {
    localStorage.setItem("application", JSON.stringify(createApplication));
  }, [handleInputChange, updateCompanyBio, updateJobDescription,handleSubmit]);


  return (
    <>
      <div className="min-h-screen bg-black">
        <div className="px-4 py-12 text-white max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-white">
            Post a New Job
          </h1>
          <div className="space-y-8 bg-neutral-900/50 sm:p-8 p-2 rounded-lg backdrop-blur-sm">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                Job Information
              </h2>
              <div>
              
                <label
                  htmlFor="jobTitle"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Job Title
                </label>
                <input
                  id="jobTitle"
                  autoComplete="off"
                  type="text"
                  className="w-full appearance-none bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={JobTitle}
                  onChange={(e) =>
                    handleInputChange("JobTitle", e.target.value)
                  }
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Category
                  </label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("Category", value)
                    }
                    value={Category}
                  >
                    <SelectTrigger
                      className="w-full bg-neutral-800/50 focus:ring-offset-0 h-fit p-[14px] focus:ring-2 focus:ring-blue-500 transition border-none "
                      defaultValue={CreateApplicationDefault.Category}
                    >
                      <SelectValue className="focus:outline-none" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-800 text-white border-none shadow-lg">
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Development">Development</SelectItem>
                      <SelectItem value="Management">Management</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label
                    htmlFor="workMode"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Work Mode
                  </label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("WorkMode", value)
                    }
                    value={WorkMode}
                  >
                    <SelectTrigger className="w-full bg-neutral-800/50 focus:ring-offset-0 h-fit p-[14px] focus:ring-2 focus:ring-blue-500 transition border-none ">
                      <SelectValue className="focus:outline-none" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-800 text-white border-none shadow-lg">
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="">
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Type
                </label>
                <Select
                  value={Type}
                  onValueChange={(value) => handleInputChange("Type", value)}
                >
                  <SelectTrigger
                    className="w-full bg-neutral-800/50  focus:ring-offset-0 h-fit p-[14px] focus:ring-2 focus:ring-blue-500 transition border-none "
                    defaultValue="Full Time"
                  >
                    <SelectValue className="focus:outline-none" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 text-white border-none shadow-lg">
                    <SelectItem value="Full Time">Full Time</SelectItem>
                    <SelectItem value="Part Time">Part Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="">
                <div>
                  <label
                    htmlFor="min"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                   Average Salary(in dollars) 
                  </label>
                  <input
                    id="min"
                    type="number"
                    className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={AverageSalary}
                    autoComplete="off"
                    onChange={(e) =>
                      handleInputChange("AverageSalary", e.target.value)
                    }
                  />
                </div>
                
              </div>
              <div className={`${WorkMode==='Remote'? "hidden":"block"}`}>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={Location}
                  autoComplete="off"
                  onChange={(e) =>
                    handleInputChange("Location", e.target.value)
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="applicationLink"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Application Link (optional)
                </label>
                <input
                  id="applicationLink"
                  type="text"
                  className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={ApplicationLink}
                  autoComplete="off"
                  onChange={(e) =>
                    handleInputChange("ApplicationLink", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-lg font-semibold text-white">
                Responsibililties
              </label>
              <div>
                <TextEditor
                  initialContent={Responsibilities}
                  onUpdate={updateJobDescription}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">
                Qualifications
              </h2>
              <div>
                <TextEditor
                  initialContent={Qualification!}
                  onUpdate={updateQualification}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                Company's Information
              </h2>
              <div>
                <label
                  htmlFor="companyLogo"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Company Logo
                </label>
                <input
                  id="companyLogo"
                  type="file"
                  className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  onChange={(e) => {
                    console.log(e);
                    const file = e.target.files ? e.target.files[0] : null;
                    console.log(file);
                    handleInputChange("CompanyLogo", file);
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  autoComplete="off"
                  className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={CompanyName}
                  onChange={(e) =>
                    handleInputChange("CompanyName", e.target.value)
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="companyEmail"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Company Email
                </label>
                <input
                  id="companyEmail"
                  autoComplete="off"
                  type="email"
                  className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={CompanyEmail}
                  onChange={(e) =>
                    handleInputChange("CompanyEmail", e.target.value)
                  }
                />
              </div>
              <div className="">
                <label
                  htmlFor="companyBio"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Company Overview
                </label>
                <TextEditor
                  initialContent={CompanyOverview as JSONContent}
                  onUpdate={updateCompanyBio}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                onClick={handleSubmit}
              >
                Submit Job Posting
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}