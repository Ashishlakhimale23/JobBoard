import { cn } from "../utils/cn";

export function CardSkeleton() {
  const shimmerClass = 
    "animate-shimmer bg-gradient-to-r from-zinc-500/5 via-zinc-500/10 to-zinc-500/5 bg-[length:400%_100%]";

  return (
    <div className={cn(
      "bg-zinc-900/50 rounded-xl py-12 overflow-hidden", 
      shimmerClass
    )}>
    </div>
  );
}