import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { auth } from "../utils/FirebaseAuth";
import { z } from "zod";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import { useRecoilState } from "recoil";
import { LoggedState } from "../store/atom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [logged, setLogged] = useRecoilState<boolean>(LoggedState);

  type SchemaProp = z.infer<typeof UserData>;

  useEffect(() => {
    if (logged) {
      navigate("/dashboard");
    }
  }, [logged, navigate]);

  const UserData = z.object({
    email: z
      .string()
      .email()
      .refine((email) => email.endsWith("@gmail.com"), {
        message: "Must be a valid Gmail address",
      }),
    password: z
      .string()
      .regex(
        /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
        "Password must be at least 6 characters long, should contain at least one special character, number, and lowercase letter"
      ),
  });

  const DataVerfication = (data: SchemaProp) => {
    return UserData.safeParse(data);
  };

  const handelsubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!email.length) {
        return toast.error("Fill the email field");
      }
      if (!password.length) {
        return toast.error("Fill the password field");
      }

      const data = { email, password };
      const ParsedResult = DataVerfication(data);

      if (!ParsedResult.success) {
        const problem: string = ParsedResult.error.issues[0].message;
        return toast.error(problem);
      }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idtoken = await userCredential.user.getIdToken(true);

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
            toast.error("Invalid credentials");
            break;
          case "auth/invalid-email":
            toast.error("Invalid email");
            break;
          case "auth/user-disabled":
            toast.error("This email is disabled");
            break;
          case "auth/user-not-found":
            toast.error("User not found");
            break;
          case "auth/wrong-password":
            toast.error("Wrong password");
            break;
          default:
            toast.error("Unexpected error");
            break;
        }
      }
    },
    [email, password, setLogged]
  );

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

  return (
    <>
      <div className="font-space min-h-screen flex flex-col justify-center">
        <form
          onSubmit={handelsubmit}
          className="relative sm:w-96 mx-auto text-center"
        >
          <div className="text-4xl font-bold mb-3">
            <p>Welcome back</p>
          </div>
          <label>
            Don't have an account?
            <a href="/signup" className="underline hover:text-blue-500">
              Signup
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
                  Login
                </button>
                <hr className="w-full border-black border" />
                <button
                  type="button"
                  className="w-full px-5 py-3 bg-white mt-2 text-black rounded-md border-2 border-black hover:bg-black hover:text-white"
                  onClick={handlegooglesubmit}
                >
                  Google
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
