"use client";

import { Search, RotateCcw } from "lucide-react";

export type StatusFilterOption<T extends string> = {
  value: T;
  label?: string;
};

type StatusFilterBarProps<T extends string> = {
  search: string;
  onSearchChange: (value: string) => void;

  selectedStatus: T;
  onStatusChange: (status: T) => void;

  defaultStatus: T;
  statuses: StatusFilterOption<T>[];

  searchPlaceholder?: string;
  resetLabel?: string;
};

export function StatusFilterBar<T extends string>({
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  defaultStatus,
  statuses,
  searchPlaceholder = "Rechercher...",
  resetLabel = "Réinitialiser",
}: StatusFilterBarProps<T>) {
  const handleReset = () => {
    onSearchChange("");
    onStatusChange(defaultStatus);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm font-[Inter,system-ui,sans-serif]">
      <div className="flex flex-col gap-3 p-4 border-b border-slate-100 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs font-medium text-slate-700 outline-none transition placeholder:text-slate-400 hover:bg-white focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {statuses.map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() => onStatusChange(status.value)}
              className={`inline-flex h-9 items-center justify-center rounded-lg px-3 text-xs font-semibold transition-colors cursor-pointer ${
                selectedStatus === status.value
                  ? "bg-slate-900 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {status.label ?? status.value}
            </button>
          ))}

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {resetLabel}
          </button>
        </div>
      </div>
    </div>
  );
}