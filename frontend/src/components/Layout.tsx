import { Navigate, Route, Routes,useMatch } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { CreateApplication } from "../pages/CreateApplication";
import { Home } from "../pages/LandingPage";
import { Jobs } from "../pages/Jobs";
import { Header } from "./Header";
import { JobInfo } from "@/pages/JobInfo";
import { ProfileInfo } from "../pages/ProfileInfoForm";
import { UserProfiles } from "@/pages/UserProfile";
import { Dashboard } from "@/pages/Dashboard";
import { ShowApplicant } from "@/pages/ShowApplicant";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { authState } from "@/store/atom";
import { useRecoilState } from "recoil";

export function Layout() {
  const matchForEntry = useMatch("/");
  const [auth, setAuthState] = useRecoilState(authState);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("AccessToken");
      if (!token) {
        setAuthState({ isAuthenticated: false, isLoading: false });
        return;
      }
      
      try {
        const decodedToken: { exp: number } = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("AccessToken");
          setAuthState({ isAuthenticated: false, isLoading: false });
        } else {
          setAuthState({ isAuthenticated: true, isLoading: false });
        }
      } catch (error) {
        console.error("Invalid token format:", error);
        localStorage.removeItem("AccessToken");
        setAuthState({ isAuthenticated: false, isLoading: false });
      }
    };

    checkAuth();
  }, [setAuthState]);

  if (auth.isLoading) {
    return <div>Loading...</div>; 
  }

  return (
    <>
      {!matchForEntry && <Header />}
      <Routes>
        <Route
          path="/"
          element={auth.isAuthenticated ? <Navigate to='/jobs' replace /> : <Home />}
        />
        <Route element={<PrivateRoute />}>
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/createpost" element={<CreateApplication />} />
          <Route path="/editprofile" element={<ProfileInfo />} />
          <Route path="/job/:jobLink" element={<JobInfo />} />
          <Route path="/:Name" element={<UserProfiles />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applicants/:JobLink" element={<ShowApplicant />} />
        </Route>
      </Routes>
    </>
  );
}