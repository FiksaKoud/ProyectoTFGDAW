import { cn } from "@/lib/utils";

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-emerald-100/70",
        className,
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-emerald-100/80 bg-white p-5">
      <Skeleton className="mb-4 h-32 w-full" />
      <Skeleton className="mb-2 h-5 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}
