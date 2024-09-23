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

export function CreateApplication(){


  const [createApplication,setCreateApplication] = useRecoilState(Application);
  const {JobTitle,JobDescription,Location,ApplicationLink,Type,MaxSalary,MinSalary,Category,WorkMode,CompanyName,CompanyEmail,CompanyBio,CompanyLogo} = createApplication;


const handleInputChange = (field: keyof typeof createApplication, value: any) => {
    setCreateApplication(prev => ({
      ...prev,
      [field]: value,
    }));
  };

 const updateJobDescription = (content: JSONContent) => {
    setCreateApplication(prev => ({ ...prev, JobDescription: content }));
  };

  const updateCompanyBio = (content: JSONContent) => {
    setCreateApplication(prev => ({ ...prev, CompanyBio: content }));
  };

  return (
    <>
      <div className="min-h-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <div className="px-4 py-12 text-white max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-white">
            Post a New Job
          </h1>
          <div className="space-y-8 bg-neutral-900/50 sm:p-8 p-2 rounded-lg backdrop-blur-sm">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="jobTitle"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Job Title
                </label>
                <input
                  id="jobTitle"
                  type="text"
                  className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={JobTitle}
                  onChange={(e) => handleInputChange('JobTitle',e.target.value)}

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

                      onValueChange={(value) => handleInputChange('Category', value)} 

                      value={Category}
                   >

                  <SelectTrigger className="w-full bg-neutral-800/50 focus:ring-offset-0 h-fit p-[14px] focus:ring-2 focus:ring-blue-500 transition border-none "
                      defaultValue={CreateApplicationDefault.Category}
                      >
                    <SelectValue
                      className="focus:outline-none"
                    />
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

                      onValueChange={(value) => handleInputChange('WorkMode', value)} 

                  value={WorkMode}
                  >

                  <SelectTrigger className="w-full bg-neutral-800/50 focus:ring-offset-0 h-fit p-[14px] focus:ring-2 focus:ring-blue-500 transition border-none "
                  >
                    <SelectValue
                      className="focus:outline-none"
                    />
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
                      onValueChange={(value) => handleInputChange('Type', value)} 
                 >
                  <SelectTrigger className="w-full bg-neutral-800/50  focus:ring-offset-0 h-fit p-[14px] focus:ring-2 focus:ring-blue-500 transition border-none "
                  defaultValue="Full Time"
                  
                      >
                    <SelectValue
                      className="focus:outline-none"
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 text-white border-none shadow-lg">
                    <SelectItem value="Full Time">Full Time</SelectItem>
                    <SelectItem value="Part Time">Part Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="min"
                    className="block text-sm font-medium text-gray-300 mb-1" > Min Salary
                  </label>
                  <input
                    id="min"
                    type="number"
                    className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={MinSalary}

                      onChange={(e) => handleInputChange('MinSalary', e.target.value)}
                     />
                     </div>
                <div>
                  <label
                    htmlFor="max"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Max Salary
                  </label>
                  <input
                    id="max"
                    type="number"
                    className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={MaxSalary}

                      onChange={(e) => handleInputChange('MaxSalary', e.target.value)}
                  />
                </div>
              </div>
              <div>
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

                      onChange={(e) => handleInputChange('Location', e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="applicationLink"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Application Link
                </label>
                <input
                  id="applicationLink"
                  type="text"
                  className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={ApplicationLink}

                      onChange={(e) => handleInputChange('ApplicationLink', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                Job Description
              </h2>
              <div>
                <TextEditor initialContent={JobDescription} onUpdate={updateJobDescription} />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                Company Information
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
                  value={typeof CompanyLogo ==="string" ? CompanyLogo : "" }

                  onChange={(e) => handleInputChange('CompanyLogo', e.target.value)}
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
                  className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={CompanyName}
                  onChange={(e) => handleInputChange('CompanyName', e.target.value)}
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
                  type="email"
                  className="w-full bg-neutral-800/50 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={CompanyEmail}
                  onChange={(e) => handleInputChange('CompanyEmail', e.target.value)}
                />
              </div>
              <div className="">
                <label
                  htmlFor="companyBio"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Company Bio
                </label>
                <TextEditor initialContent={CompanyBio} onUpdate={updateCompanyBio}/>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
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