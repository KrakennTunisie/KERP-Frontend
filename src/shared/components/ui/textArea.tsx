import { cn } from "@/shared/utils/cn";
import { Label } from "./label";

type TextareaProps = React.ComponentProps<"textarea"> & {
  label?: string;
  error?: string;
  required?: boolean;
};

export function Textarea({
  label,
  error,
  required,
  className,
  ...props
}: TextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <textarea
        className={cn(
            "flex w-full min-w-0 min-h-28 rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-800 shadow-sm outline-none transition-all duration-200",

            "align-top resize-y",

            "placeholder:text-slate-400",

            "hover:border-slate-300 hover:bg-slate-50/70",

            "focus-visible:border-blue-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-100",

            "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-70 disabled:resize-none",

            error
            ? "border-red-500 bg-red-50/30 focus-visible:border-red-500 focus-visible:ring-red-100"
            : "border-slate-200",
            className
        )}
        {...props}
        />

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}