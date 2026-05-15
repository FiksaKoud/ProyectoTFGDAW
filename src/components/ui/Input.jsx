import { cn } from "@/lib/utils";

export function Input({ className, label, error, id, ...props }) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-emerald-950"
        >
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={cn(
          "h-11 w-full rounded-xl border border-emerald-200 bg-white px-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200",
          error && "border-red-400 focus:border-red-500 focus:ring-red-100",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
