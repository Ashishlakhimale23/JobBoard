import { useParams } from "react-router-dom";
import { cn } from "../utils/cn";

export function UserProfileSkeleton() {
  const param  = useParams();
  const shimmerClass =
    "animate-shimmer bg-gradient-to-r from-zinc-500/5 via-zinc-500/10 to-zinc-500/5 bg-[length:400%_100%]";

  return (
    <div className="sm:max-w-4xl sm:mx-auto space-y-4 p-3">
      <header className="space-y-4 pb-6">
        <div className="rounded-2xl antialiased">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div
                className={cn("h-16 w-16 bg-zinc-700/50 rounded-full", shimmerClass)}
              ></div>
            </div>
            <div className="flex justify-center">
              <div
                className={cn("h-6 w-32 bg-zinc-700/50 rounded-md", shimmerClass)}
              ></div>
            </div>
            <div className={`flex justify-center ${param.Name != undefined ? "hidden":''}`}>
              <div
                className={cn("h-6 w-44 bg-zinc-700/50 rounded-md", shimmerClass)}
              ></div>
            </div>
            <div className={`flex gap-2 justify-center ${param.Name == undefined ? "hidden" :""} `}>
              <div
                className={cn("h-6 w-6 rounded-full bg-zinc-700/50", shimmerClass)}
              ></div>
              <div
                className={cn("h-6 w-6 rounded-full bg-zinc-700/50", shimmerClass)}
              ></div>
            </div>
            
          </div>
        </div>
      </header>

      <div className="space-y-4">
        <div className="h-6 w-28 rounded-md bg-zinc-700/50"></div>
        <div className={cn("h-4 w-full rounded-md", shimmerClass)}></div>
        <div className={cn("h-4 w-full rounded-md", shimmerClass)}></div>
      </div>

      <div className="space-y-4">
        <div className="h-6 w-28 rounded-md bg-zinc-700/50"></div>
        <div className="flex flex-wrap gap-2">
          <div
            className={cn("h-8 w-20 rounded-full", shimmerClass)}
          ></div>
          <div
            className={cn("h-8 w-20 rounded-full", shimmerClass)}
          ></div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-6 w-28 rounded-md bg-zinc-700/50"></div>
        <div className={cn("h-4 w-full rounded-md", shimmerClass)}></div>
        <div className={cn("h-4 w-full rounded-md", shimmerClass)}></div>
      </div>

      <div className="space-y-4">
        <div className="h-6 w-28 rounded-md bg-zinc-700/50"></div>
        <div className={cn("h-4 w-full rounded-md", shimmerClass)}></div>
        <div className={cn("h-4 w-full rounded-md", shimmerClass)}></div>
      </div>

      <div className="space-y-4">
        <div className="h-6 w-28 rounded-md bg-zinc-700/50"></div>
        <div className={cn("h-4 w-full rounded-md", shimmerClass)}></div>
        <div className={cn("h-4 w-full rounded-md", shimmerClass)}></div>
      </div>
    </div>
  );
}
