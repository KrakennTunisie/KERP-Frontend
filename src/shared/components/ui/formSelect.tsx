import React from "react";

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ReactNode;
  error?: string;
};


import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Label } from "./label";

type FormSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  required?: boolean;
  tooltip?: string;
  children: React.ReactNode;
};

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      icon,
      error,
      required,
      tooltip,
      children,
      className,
      id,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={id} required={required} tooltip={tooltip}>
            {label}
          </Label>
        )}

        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 items-center text-slate-400">
              {icon}
            </div>
          )}

          <select
            ref={ref}
            id={id}
            data-slot="select"
            aria-invalid={!!error}
            className={cn(
              "flex h-11 w-full min-w-0 appearance-none rounded-xl border bg-white py-2 text-sm text-slate-800 shadow-sm outline-none transition-all",

              icon ? "pl-10 pr-10" : "pl-3.5 pr-10",

              "placeholder:text-slate-400",

              "hover:border-slate-300 hover:bg-slate-50/70",

              "focus-visible:border-blue-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-100",

              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-70",

              error
                ? "border-red-500 bg-red-50/30 focus-visible:border-red-500 focus-visible:ring-red-100"
                : "border-slate-200",

              className
            )}
            {...props}
          >
            {children}
          </select>

          <div className="pointer-events-none absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center text-slate-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>

        {error && (
          <p className="text-xs font-medium text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";