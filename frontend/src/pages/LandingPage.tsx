import { TypewriterEffect } from "../components/Landing"
import { GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import {auth} from "../utils/FirebaseAuth"
import {toast} from "react-hot-toast"
import axios from "axios";
import { LoggedState } from "../store/atom";
import { useRecoilState } from "recoil";
export function Home() {
  const [logged, setLogged] = useRecoilState<boolean>(LoggedState);
  
  const handlegooglesubmit = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idtoken = await result.user.getIdToken(true);

      if (!String(idtoken).length || idtoken === undefined) {
        return toast.error("Error while signing up");
      }

      const response = await axios.post(`${process.env.BASE_URL}/user/login`, { idtoken });

      if (Object.values(response.data).includes("Logged in")) {
        localStorage.setItem("AccessToken", idtoken);
        setLogged(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      const errorMessage: string = error.code;
      switch (errorMessage) {
        case "auth/invalid-credential":
          toast.error("Invalid credentials, please check the sign-in method");
          break;
        case "auth/operation-not-supported-in-this-environment":
          toast.error("HTTP protocol is not supported. Please use HTTPS");
          break;
        case "auth/popup-blocked":
          toast.error("Popup has been blocked by the browser");
          break;
        case "auth/popup-closed-by-user":
          toast.error("Popup has been closed by the user");
          break;
        case "auth/operation-not-allowed":
          toast.error("Email/password accounts are not enabled");
          break;
        default:
          toast.error("Internal server issue");
          break;
      }
    }
  };


  const handleGoogleSubmit = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(true);

      if (!idToken) {
        return toast.error("Error while signing up");
      }

      const response = await axios.post(`${process.env.BASE_URL}/user/signup`, {
        idtoken: idToken,
        username: result.user.displayName,
      });

      if (Object.values(response.data).includes("created account")) {
        localStorage.setItem("AccessToken", idToken);
        setLogged(true);
      } else {
        return toast.error(response.data.message);
      }
    } catch (error: any) {
      const errorMessage = error.code;
      switch (errorMessage) {
        case "auth/operation-not-supported-in-this-environment":
          toast.error("HTTP protocol is not supported. Please use HTTPS");
          break;
        case "auth/popup-blocked":
          toast.error("Popup has been blocked by the browser");
          break;
        case "auth/popup-closed-by-user":
          toast.error("Popup has been closed by the user before completion");
          break;
        case "auth/operation-not-allowed":
          toast.error("Email/password accounts are not enabled");
          break;
        default:
          toast.error("Internal server issue");
      }
    }
  };
  return (
    <>
      <div className="absolute top-0 z-[-2] h-screen w-screen flex justify-center items-center bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <div className="flex flex-col text-center space-y-6 "> 
          <h1 className="text-white sm:text-2xl antialiased font-medium">
            Connecting talent with jobs.
          </h1>
          <TypewriterEffect
            words={[
              { text: " Find", className: "highlight" },
              { text: " Your", className: "highlight" },
              { text: " Next ", className: "highlight" },
              { text: " Opportunity ", className: "highlight" },
              { text: " with", className: "highlight" },
              { text: " SkillSphere.", className: "highlight" },
            ]}
            className="typewriter-effect"
            cursorClassName="cursor"
          />
          <div className="flex justify-center space-x-6">
            <button className=" px-6 sm:px-10 py-2 border border-white text-white rounded-lg"
            onClick={handleGoogleSubmit}
            >
              Join now
            </button>
            <button className=" px-6 sm:px-10 py-2 border bg-white text-black rounded-lg"
            onClick={handlegooglesubmit}
            >
              Signup
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
