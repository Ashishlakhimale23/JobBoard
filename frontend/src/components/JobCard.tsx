import { api } from "@/utils/AxioApi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


export function JobCard({
  CompanyLogo,
  JobTitle,
  Type,
  WorkMode,
  Location,
  AverageSalary,
}: {
  CompanyLogo: string;
  JobTitle: string;
  Type: string;
  WorkMode: string;
  Location: string;
  AverageSalary: number;
}) {




  return (
    <div className="bg-zinc-950 h-fit w-full hover:bg-zinc-800 rounded-lg transition-colors duration-300 px-6 py-8 flex flex-col space-y-6 justify-between ">

      <div className=" space-y-6 p-2">
     
        <div>
          <img src={CompanyLogo} alt={`${JobTitle} logo`} className="h-14 w-14 rounded-full" />
        </div>

        <div>
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

        <div className="bg-gray-100 rounded-full px-4 py-1">
          <p className="text-black font-semibold">${AverageSalary.toLocaleString()}</p>
        </div>
   
        <p className="ml-2 text-gray-500">Avg. salary</p>
      </div>
    </div>
  );
}
