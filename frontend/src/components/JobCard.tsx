export function JobCard({CompanyLogo,JobTitle,Type,WorkMode,Location,AverageSalary}:{CompanyLogo:string,JobTitle:string,Type:string,WorkMode:string,Location:string,AverageSalary:number}){
  return (
    <>
      <div className="rounded-2xl border sm:flex sm:justify-between space-y-4 sm:space-y-0 border-gray-400 p-4 shadow-lg hover:bg-accent-foreground antialiased">
        <div className="sm:flex sm:space-x-3 space-y-4 sm:space-y-0">
          <div>
            <img src={CompanyLogo} alt="" className="h-12 w-12 rounded-full" />
          </div>
          <div className="">
            <h2 className="text-xl font-bold text-white">{JobTitle}</h2>
            <p className={`${!Location.length?'hidden':'text-gray-500'} `}  >
                {Location}/{Type}/{WorkMode}
            </p>
            <p className={`${Location.length?'hidden':'text-gray-500'} `}  >
                {Type}/{WorkMode}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <p className="px-3 text-sm py-1 h-fit text-black font-semibold  rounded-xl bg-white  ">
            ${AverageSalary}
          </p>
        </div>
      </div>
    </>
  );
}