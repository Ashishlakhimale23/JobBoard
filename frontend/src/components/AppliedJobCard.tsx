import { useNavigate } from "react-router-dom";
export function AppliedJobCard({CompanyLogo,JobTitle,Type,WorkMode,Location,JobLink,status}:{CompanyLogo:string,JobTitle:string,Type:string,WorkMode:string,Location:string,AverageSalary:number,JobLink:string,status:string}){
  const navigate = useNavigate()
  return (

    <>
      <div className="rounded-2xl cursor-pointer bg-zinc-950/85 sm:flex sm:justify-between space-y-4 sm:space-y-0  px-4 py-6  hover:bg-neutral-900/90 transition-colors duration-300 antialiased"
      onClick={()=>navigate(`/job/${JobLink}`)}
      >
      <div className="sm:flex sm:space-x-3 space-y-4 sm:space-y-0">
        <div>
          <img src={CompanyLogo} alt="" className="h-12 w-12 rounded-full" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{JobTitle}</h2>
          <p className={`${!Location ? 'hidden' : 'text-gray-400'}`}>
            {Location} / {Type} / {WorkMode}
          </p>
          <p className={`${Location ? 'hidden' : 'text-gray-400'}`}>
            {`${Type} / ${WorkMode}`}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <p className="px-3 text-sm py-1 h-fit text-gray-800 font-bold rounded-xl bg-zinc-100">
            {status}
        </p>
      </div>
    </div>
    </>
  );

}