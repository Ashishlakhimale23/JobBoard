import { useParams } from "react-router-dom"
import { api } from "@/utils/AxioApi";
import { UsersProfile } from "@/types/type";
import toast from "react-hot-toast";
import { Profiler, useEffect } from "react";
import { useRecoilState } from "recoil";
import { UserProfile, UserProfileDefault } from "@/store/atom";
import { TiptapEditor } from "@/components/ParseTipTapData";

export function UserProfiles(){
    const {Name} = useParams(); 
    const [userProfile,setUserProfile] = useRecoilState(UserProfile)
    const getuserdata=async():Promise<{Data:UsersProfile}>=>{
        try{
        const response = await api.get("/applicant/getuserdata",{
            params:{username:Name}
        })
        return response.data;
        }catch(error){
            toast.error("internal server error")
            return {Data:UserProfileDefault};
        }
    }

    useEffect(()=>{
        const fetchuserdata=async()=>{
            const result =await getuserdata();
            console.log(result.Data.workExperience)
            setUserProfile(result.Data)
            result.Data.AboutMe.length ?setUserProfile((prev)=>({...prev,AboutMe:JSON.parse(result.Data.AboutMe[0])})):null;
            result.Data.workExperience.length ?setUserProfile((prev)=>({...prev,workExperience:JSON.parse(result.Data.workExperience[0])})):null;
            result.Data.education.length ?setUserProfile((prev)=>({...prev,education:JSON.parse(result.Data.education[0])})):null;
        }
        fetchuserdata();
    },[])
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
              </div>
            </div>
          </header>
          <div className={`${!userProfile.AboutMe ? "hidden" : "block"}`}>
            <p className="font-semibold text-white text-xl">About Me</p>
            <div className="p-4">
            <TiptapEditor initialContent={userProfile.AboutMe} />
</div>
          </div>

          <div
            className={`${!userProfile.workExperience ? "hidden" : "block"}`}
          >
            <p className="font-semibold text-white text-xl">Work Experience</p>
            {userProfile.workExperience.map((work, index) => (
              <>
                <div className="p-4">
                  <div className="text-white">
                    <p className="font-semibold text-[17px]">{work.Role}</p>
                  </div>
                  <div className="text-white">
                    <p>{`${work.Location} / ${work.CompanyName}`}</p>
                  </div>
                  <div className="text-white pt-1">
                    <TiptapEditor initialContent={work.AboutJob} />
                  </div>
                </div>
              </>
            ))}
          </div>
<div
            className={`${!userProfile.education ? "hidden" : "block"}`}
          >
            <p className="font-semibold text-white text-xl">Education</p>
            {userProfile.education.map((work, index) => (
              <>
                <div className="p-4">
                  <div className="text-white text-[17px]">
                    <p className="font-semibold ">{work.UniversityName}</p>
                  </div>
                  <div className="text-white">
                    <p>{`${work.UniLocation} / ${work.CourseName}`}</p>
                  </div>
                  <div className="text-white pt-1">
                    <TiptapEditor initialContent={work.AboutCourse} />
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </>
    );
}