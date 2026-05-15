import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-emerald-100/80 bg-white p-5 shadow-sm shadow-emerald-900/5",
        className,
      )}
      {...props}
    />
  );
}
