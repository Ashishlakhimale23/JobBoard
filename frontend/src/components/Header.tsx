import { useNavigate } from "react-router-dom";
import {  SettingsModal, UserProfile } from "@/store/atom";
import { useRef,useEffect } from "react";
import { useRecoilState, useRecoilValue} from "recoil";
export function Header(){
  const navigate = useNavigate();
  const imgRef = useRef<HTMLImageElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [settingsModal, setSettingsModal] = useRecoilState(SettingsModal);
  const {Profile,Name} = useRecoilValue(UserProfile)

  useEffect(() => {
    if (settingsModal) {
      document.body.addEventListener("mousedown", settingmodal);
    } else {
      document.body.removeEventListener("mousedown", settingmodal);
    }
  }, [settingsModal, setSettingsModal, settingmodal]);

  function settingmodal(e: MouseEvent) {
    if (imgRef.current !== null && modalRef.current !== null) {
      if (
        imgRef.current &&
        !imgRef.current.contains(e.target as Node) &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        setSettingsModal(false);
      }
    }
  }
  return (
    <>
      <header className="flex justify-between  items-center max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className=" font-bold text-2xl md:text-3xl">
          <span className="bg-gradient-to-tr from-pink-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
            Skill
          </span>
          <span className="text-white">Sphere</span>
        </div>

<div className="flex items-center space-x-8">
        <div className="space-x-4 text-white font-bold ">
          <button className="hover:underline hidden sm:inline-block" onClick={() => navigate("/jobs")}>
            Jobs
          </button>
          <button
            className="hover:underline hidden sm:inline-block"
            onClick={() => navigate("/createpost")}
          >
            Post Jobs
          </button>
        </div>
        <div>
          <img
            src={Profile as string}
            className="w-11 h-11 rounded-full hover:opacity-75 md:w-[50px] md:h-[50px]"
            ref={imgRef}
            onClick={() => {
              setSettingsModal((prevSettingModal) => !prevSettingModal);
            }}
          />
        </div>
        <div
          className={`
        ${settingsModal ? "block" : "hidden"}
        fixed mt-20 bg-zinc-900 rounded-lg top-0
        right-4 md:right-6 xl:right-auto xl:left-[calc(50%+25rem)]
        w-44 max-w-7xl mx-auto
        z-20
      `}
          ref={modalRef}
        >
          <div className="bg-silver text-white font-space px-2 py-2 rounded-md">
            <button
              className=" px-[10px] py-2 hover:bg-white hover:text-black rounded-md w-full text-left font-semibold"
              onClick={() => {
                setSettingsModal(false);
                navigate(`/${Name}`);
              }}
            >
              Profile
            </button>

            <button
              className={`sm:hidden px-[10px] py-2 hover:bg-white hover:text-black rounded-md w-full text-left font-semibold`}
              onClick={() => {
                setSettingsModal(false);
                navigate("/jobs");
              }}
            >
             Jobs 
            </button>
            <button
              className="sm:hidden font-semibold px-[10px] py-2 hover:bg-white hover:text-black rounded-md w-full text-left "

              onClick={() => {
                setSettingsModal(false);
                navigate("/createpost");
              }}
            >
              Post Job 
            </button>
            <button
              className="px-[10px] py-2 hover:bg-white hover:text-black rounded-md w-full text-left font-semibold"
              onClick={() => {
                setSettingsModal(false);
                localStorage.removeItem("AccessToken");
                localStorage.removeItem("application");
                window.location.href = "/";
              }}
            >
              Signout
            </button>
          </div>
        </div>
        </div>
      </header>
    </>
  );
}