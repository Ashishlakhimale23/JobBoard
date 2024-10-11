import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/utils/AxioApi";
import { UsersProfile } from "@/types/type";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { UserProfile, UserProfileDefault } from "@/store/atom";
import { TiptapEditor } from "@/components/ParseTipTapData";
import { Icons } from "@/components/Icons";
import { UserProfileSkeleton } from "@/components/UserProfileSkeleton";

export function UserProfiles() {
  const { Name } = useParams();
  console.log(Name)
  const [userProfile, setUserProfile] = useRecoilState(UserProfile);
  const [admin, setAdmin] = useState(false);
  const [isLoading,setIsLoading] =useState<boolean>(true)
  const navigate = useNavigate();
  const getuserdata = async (): Promise<{
  Data: UsersProfile;
  admin: boolean;
}> => {
  try {
    const response = await api.get("/applicant/getuserdata", {
      params: { username: Name },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error("internal server error");
    return { Data: UserProfileDefault, admin: false };
  }
};

useEffect(() => {
  const fetchuserdata = async () => {

    const result = await getuserdata();
    setAdmin(result.admin);

    const updatedProfile = {
      ...result.Data,
      AboutMe: result.Data.AboutMe.length
        ? JSON.parse(result.Data.AboutMe[0])
        : result.Data.AboutMe,
      skills: result.Data.skills.length
        ? JSON.parse(result.Data.skills[0])
        : result.Data.skills,
      workExperience: result.Data.workExperience.length
        ? JSON.parse(result.Data.workExperience[0].toString())
        : result.Data.workExperience,
      education: result.Data.education.length
        ? JSON.parse(result.Data.education[0].toString())
        : result.Data.education,
      Projects: result.Data.Projects.length
        ? JSON.parse(result.Data.Projects[0].toString())
        : result.Data.Projects,
    };

    setUserProfile(updatedProfile);
    setIsLoading(false)
  };

  fetchuserdata();
}, [Name]);


  if(isLoading){
    return(
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
                  src={userProfile.Profile as string}
                  alt=""
                  className="h-16  w-16 rounded-full object-cover"
                />
              </div>
              <div className="flex justify-center text-white font-bold text-2xl">
                <p>{userProfile.Name}</p>
              </div>

              <div className={`flex gap-2 justify-center`}>
                <a
                  href={userProfile.twitter}
                  target="_blank"
                  className={`${userProfile.twitter ? 'text-xl font-[300] text-white' : 'hidden'} `}
                >
                  {<Icons.twitter />}
                </a>
                <a
                  href={userProfile.Linkedin}
                  target="_blank"
                  className={`${userProfile.Linkedin? 'text-xl font-[300] text-white' : 'hidden'} `}
                >
                  {<Icons.linkedin />}
                </a>
              </div>
              <div className="text-white flex justify-center">
                <button
                  className={`${
                    admin
                      ? "block px-6 font-semibold hover:bg-white hover:text-black py-2 border rounded-md"
                      : "hidden"
                  }`}
                  onClick={() =>{ 
                    navigate("/editprofile")
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className={`${!userProfile.AboutMe.content ? "hidden" : "block"}`}>
          <p className="font-semibold text-white text-xl">About Me</p>
          <div className="p-4">
            <TiptapEditor initialContent={userProfile.AboutMe} />
          </div>
        </div>

        <div className={`${!userProfile.skills.length ? "hidden" : "block"}`}>
          <p className="font-semibold text-white text-xl">Skills</p>
          <div className="p-4 flex flex-wrap gap-1">
            {userProfile.skills &&
              userProfile.skills.map((items, index) => (
                <div
                  key={index}
                  className="px-2 text-white py-1 bg-zinc-800 rounded-full"
                >
                  {items}
                </div>
              ))}
          </div>
        </div>

        <div className={`${!userProfile.workExperience.length ? "hidden" : "block"}`}>
          <p className="font-semibold text-white text-xl">Work Experience</p>
          {userProfile.workExperience.map((work, index) => (
            <>
              <div className="p-4" key={index}>
                <div className="text-white">
                  <p className="font-semibold text-[17px]">{work.Role}</p>
                </div>
                <div className="text-white sm:flex sm:justify-between">
                  <p>{`${work.Location} / ${work.CompanyName}`}</p>
                  <p>{`${work.JoiningYear} - ${work.LeavingYear}`}</p>
                </div>
                <div className="text-white pt-1">
                  <TiptapEditor initialContent={work.AboutJob} />
                </div>
              </div>
            </>
          ))}
        </div>
        <div className={`${!userProfile.education.length ? "hidden" : "block"}`}>
          <p className="font-semibold text-white text-xl">Education</p>
          {userProfile.education.map((work, index) => (
            <>
              <div className="p-4" key={index}>
                <div className="text-white text-[17px]">
                  <p className="font-semibold ">{work.UniversityName}</p>
                </div>

                <div className="text-white sm:flex sm:justify-between">
                  <p>{`${work.UniLocation} / ${work.CourseName}`}</p>
                  <p>{`${work.StartYear} - ${work.EndYear}`}</p>
                </div>
                <div className="text-white pt-1">
                  <TiptapEditor initialContent={work.AboutCourse} />
                </div>
              </div>
            </>
          ))}
        </div>

        <div className={`${!userProfile.Projects.length ? "hidden" : "block"}`}>
          <p className="font-semibold text-white text-xl">Projects</p>
          {userProfile.Projects.map((work, index) => (
            <>
              <div className="p-4" key={index}>
                <div className="text-white text-[17px] sm:flex justify-between ">
                  <p className="font-semibold ">{work.Title}</p>
                  <div className="space-x-2">
                <a
                  href={work.GithubLink}
                  target="_blank"
                  className={`${work.GithubLink ? 'hover:underline text-white' : 'hidden'} `}
                >
                  Github
                </a>
                <a
                  href={work.LiveLink as string}
                  target="_blank"
                  className={`${work.LiveLink? 'hover:underline text-white' : 'hidden'} `}
                >
                  Live Link
                </a>
</div>
                </div>

                <div className="text-white pt-1">
                  <TiptapEditor initialContent={work.AboutProject} />
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}
