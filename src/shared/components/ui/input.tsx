import { cn } from "@/shared/utils/cn";
import { Label } from "./label";

type InputProps = React.ComponentProps<"input"> & {
  label?: string;
  error?: string;
  required?: boolean;
  tooltip?: string;
  icon?: React.ReactNode;
};

function Input({
  className,
  type,
  label,
  tooltip,
  error,
  required,
  id,
  icon,
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label
          tooltip={tooltip}
          htmlFor={id}
          required={required}
        >
          {label}
        </Label>
      )}

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 items-center text-slate-400">
            {icon}
          </div>
        )}

        <input
          id={id}
          type={type}
          data-slot="input"
          aria-invalid={!!error}
          className={cn(
            "flex h-11 w-full min-w-0 rounded-xl border bg-white py-2 text-sm text-slate-800 shadow-sm outline-none transition-all",

            icon ? "pl-10 pr-3.5" : "px-3.5",

            "placeholder:text-slate-400",

            "hover:border-slate-300 hover:bg-slate-50/70",

            "focus-visible:border-blue-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-100",

            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-70",

            error
              ? "border-red-500 bg-red-50/30 focus-visible:border-red-500 focus-visible:ring-red-100"
              : "border-slate-200",

            "file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-700",

            className,
          )}
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export { Input };