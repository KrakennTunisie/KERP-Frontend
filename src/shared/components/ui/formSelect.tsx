import React from "react";

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ReactNode;
  error?: string;
};

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, icon, error, className, ...props }, ref) => {
    return (
      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">
          {label}
        </label>

        <div
          className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm transition focus-within:border-emerald-300 focus-within:ring-4 focus-within:ring-emerald-50 ${
            error ? "border-rose-200" : "border-slate-200"
          }`}
        >
          {icon && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-50">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={`w-full bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300 ${className ?? ""}`}
            {...props}
          />
        </div>

        {error && (
          <p className="mt-1.5 text-xs font-semibold text-rose-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

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