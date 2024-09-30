import { useNavigate } from "react-router-dom";

export function Header(){
    const navigate = useNavigate();
    return (
      <>
        <header className="flex justify-between  items-center max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className=" font-bold text-2xl md:text-3xl">
            <span className="bg-gradient-to-tr from-pink-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
              Skill
            </span>
            <span className="text-white">Sphere</span>
          </div>

          <div className="space-x-4 text-white font-bold ">
            <button className="hover:underline" onClick={()=>navigate('/jobs')}>Jobs</button>
            <button className="hover:underline" onClick={()=>navigate('/createpost')}>Post Jobs</button>
          </div>
        </header>
      </>
    );
}