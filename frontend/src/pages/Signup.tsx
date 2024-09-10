import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/FirebaseAuth.tsx";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import axios from "axios";
import { useRecoilState } from "recoil";
import { LoggedState } from "../store/atom";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [logged, setLogged] = useRecoilState<boolean>(LoggedState);

  useEffect(() => {
    if (logged) {
      navigate("/dashboard");
    }
  }, [logged, navigate]);

  const UserData = z.object({
    email: z.string().email().refine((email) => email.endsWith("@gmail.com"), {
      message: "Must be a valid Gmail address",
    }),
    password: z.string().regex(
      /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
      "Password must be at least 6 characters long and should contain at least one special character, number, and lowercase letter"
    ),
  });

  const DataVerification = (data: { email: string; password: string }) => {
    const ParsedResult = UserData.safeParse(data);
    return ParsedResult;
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        if (!email.length) {
          return toast.error("Fill the email field");
        }
        if (!password.length) {
          return toast.error("Fill the password field");
        }

        const data = { email, password };
        const parsedResult = DataVerification(data);

        if (!parsedResult.success) {
          const problem = parsedResult.error.issues[0].message;
          return toast.error(problem);
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken(true);

        const response = await axios.post(`${process.env.BASE_URL}/user/signup`, {
          idtoken: idToken,
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
          case "auth/weak-password":
            toast.error("Weak password");
            break;
          case "auth/email-already-in-use":
            toast.error("Email already in use");
            break;
          case "auth/invalid-email":
            toast.error("Invalid email");
            break;
          case "auth/operation-not-allowed":
            toast.error("Email/password accounts are not enabled");
            break;
          default:
            toast.error("Unexpected error");
        }
      }
    },
    [email, password, setLogged]
  );

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
    <div className="font-space min-h-screen flex flex-col justify-center">
      <form onSubmit={handleSubmit} className="relative sm:w-96 mx-auto text-center">
        <div className="text-4xl font-bold mb-3">
          <p>Review.to</p>
        </div>
        <label>
          Already have an account?{" "}
          <a href="/login" className="underline hover:text-blue-500">
            Log in
          </a>
        </label>
        <div className="mt-4 bg-white rounded-lg border-2 border-black shadow-lg">
          <div className="px-3 py-4">
            <label className="block font-semibold text-left">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="mt-2 focus:border-black border-2 w-full h-5 rounded-md px-4 py-5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="block mt-2 font-semibold text-left">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="mt-2 w-full h-5 border-2 focus:border-black rounded-md px-4 py-5 mb-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="space-y-2">
              <button
                type="submit"
                className="w-full px-5 py-3 bg-white mt-2 text-black rounded-md border-2 border-black hover:bg-black hover:text-white"
              >
                Signup
              </button>
              <hr className="w-full border-black border" />
              <button
                type="button"
                className="w-full px-5 py-3 bg-white mt-2 text-black rounded-md border-2 border-black hover:bg-black hover:text-white"
                onClick={handleGoogleSubmit}
              >
                Google
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Signup;
