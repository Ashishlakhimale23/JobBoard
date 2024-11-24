import { TypewriterEffect } from "../components/Landing"
import { GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import {auth} from "../utils/FirebaseAuth"
import {toast} from "react-hot-toast"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useSetRecoilState} from "recoil";
import { authState } from "@/store/atom";
export function Home() {

  const setAuthStates = useSetRecoilState(authState)
  const navigate = useNavigate()

  const handleGoogleAuth = async (type: "signin" | "signup") => {
  const provider = new GoogleAuthProvider();

    toast.loading('Logging in...',{id:'loading'})
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken(true); 

    if (!idToken) {
      return toast.error("Error during authentication");
    }

    
    const apiEndpoint = type === "signup" 
      ? `${process.env.BASE_URL}/user/signup` 
      : `${process.env.BASE_URL}/user/login`;

    
    const response = await axios.post(apiEndpoint, {
      idtoken: idToken,
    });

    
    if ((type === "signup" && response.data.message === "created account") ||
        (type === "signin" && response.status == 200)) {
      localStorage.setItem("AccessToken",idToken);
      setAuthStates({ isAuthenticated: true, isLoading: false });
      navigate('/jobs')
    } else {
      return toast.error(response.data.message); 
    }
  } catch (error: any) {
    const errorMessage = error.code;
    console.log("Firebase auth error:", errorMessage);

    
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
    }
  }finally{
    toast.dismiss('loading')
  }
};

  
return (
   <div className=" min-h-screen w-full bg-black overflow-hidden">
  


  <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

    <header className="flex justify-center sm:justify-between items-center ">
      <div className=" font-bold text-2xl md:text-3xl">
        <span className="bg-gradient-to-tr from-pink-500 via-red-500 to-orange-500 bg-clip-text text-transparent">Skill</span>
        <span className="text-white">Sphere</span>
      </div>

      <div className="space-x-4 hidden sm:flex">
        <button
          className="px-4 sm:px-6 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-black transition-colors"
          onClick={()=>handleGoogleAuth("signup")}
        >
          Join now
        </button>
        <button
          className="px-4 sm:px-6 py-2 border bg-white text-black rounded-lg hover:bg-black hover:text-white transition-colors"
          onClick={()=>handleGoogleAuth("signin")}
        >
          Signin
        </button>
      </div>
    </header>


    <div className="flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 h-[calc(100vh-176px)]">
      <p className="bg-gradient-to-b p-3 text-transparent bg-clip-text from-white to-gray-400 text-3xl md:text-4xl lg:text-5xl font-bold">
        Connecting talent with jobs.
      </p>

   
      <TypewriterEffect
        words={[
          { text: "Find" },
          { text: "Your" },
          { text: "Next" },
          { text: "Opportunity" },
          { text: "with" },
          {
            text: "SkillSphere.",
            className: "text-blue-500 font-bold ",
          },
        ]}
        className="text-2xl md:text-4xl lg:text-5xl "
      />


      <div className="space-x-4 block sm:hidden">
        <button
          className="px-4 sm:px-6 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-black transition-colors"
          onClick={()=>handleGoogleAuth("signup")}
        >
          Join now
        </button>
        <button
          className="px-4 sm:px-6 py-2 border bg-white text-black rounded-lg hover:bg-black hover:text-white transition-colors"
          onClick={()=>handleGoogleAuth("signin")}
        >
          Signin
        </button>
      </div>
    </div>
  </div>

</div>

  );
}
