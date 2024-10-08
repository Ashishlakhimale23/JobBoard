import { Route, Routes, useLocation } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { CreateApplication } from "./CreateApplication";
import { Home } from "../pages/LandingPage";
import { Jobs } from "../pages/Jobs";
import { Header } from "./Header";
import { JobInfo } from "@/pages/JobInfo";
import { ProfileInfo } from "./ProfileInfoForm";
import { UserProfiles } from "@/pages/UserProfile";
import { Dashboard } from "@/pages/Dashboard";

export function Layout(){
  const onheader:[string] = ['/'];
  const location = useLocation();

    return (
      <>
      {!onheader.includes(location.pathname) && <Header/>}
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route element={<PrivateRoute/>}>
          <Route path="/jobs" element={<Jobs/>} />
         <Route path="/createpost" element={<CreateApplication/>}/>
         <Route path="/editprofile" element={<ProfileInfo/>}/>
         <Route path="/job/:jobLink" element={<JobInfo/>}/>
         <Route path="/:Name" element={<UserProfiles/>}/>
         <Route path="/dashboard" element={<Dashboard/>}/>

          </Route>
        </Routes>
      </>
    );
}