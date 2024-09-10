import { DataCard } from "../components/DataCard";

export function Dashboard(){
    return (
      <>
        <div className="antialiased font-sans sm:max-w-5xl  mx-auto">
          <div className="px-5 py-10 w-full sm:text-center font-medium text-xl sm:font-semibold sm:text-3xl">
            <p className="">Konnichiwa, Ashish lakhimale.</p>
          </div>
          <div className="px-5 ">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Recently visited</p>
              <button className="outline-none text-gray-600 p-2 border-black border-2 rounded-md">Create new</button>
            </div>

            <div className=" mt-4 grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center mx-auto ">
              <DataCard title="whiteboard" date="16 june" />

              <DataCard title="whiteboard" date="16 june" />
            </div>
          </div>
        </div>
      </>
    );
}