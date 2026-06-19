"use client";

import { ActionMenu } from "@/shared/components/ui/actionMenuItem";
import { Search, RotateCcw, DownloadCloud, Download, HardDriveDownload } from "lucide-react";

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
  onDownloadCurrentYear?: ()=>void;
  onDownloadAll?: ()=>void;
  onDownloadFitered?: ()=>void

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
  onDownloadAll,
  onDownloadCurrentYear,
  onDownloadFitered
}: StatusFilterBarProps<T>) {
  const handleReset = () => {
    onSearchChange("");
    onStatusChange(defaultStatus);
  };

   const actions = [
    ...(onDownloadAll
      ? [
          {
            label: "Télécharger tout",
            icon: DownloadCloud,
            color: "text-amber-600",
            hover: "hover:bg-amber-50",
            onClick: () => onDownloadAll(),
          },
        ]
      : []),

    ...(onDownloadFitered
      ? [
          {
            label: "Contenu filtré",
            icon: Download,
            color: "text-emerald-600",
            hover: "hover:bg-emerald-50",
            onClick: () => onDownloadFitered(),
          },
        ]
      : []),

    ...(onDownloadCurrentYear
      ? [
          {
            label: "Année actuelle",
            icon: HardDriveDownload,
            color: "text-violet-600",
            hover: "hover:bg-violet-50",
            onClick: () => onDownloadCurrentYear(),
          },
        ]
      : []),
  ];

  return (
<div className="rounded-2xl border border-slate-200 bg-white shadow-sm font-[Inter,system-ui,sans-serif]">

  <div className="flex flex-col gap-3 p-3 border-b border-slate-100 lg:flex-row lg:items-center lg:justify-between">

    {/* SEARCH */}
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />

      <input
        type="text"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-[11px] font-medium text-slate-700 outline-none transition placeholder:text-slate-400 hover:bg-white focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
      />
    </div>

    {/* ACTIONS */}
    <div className="flex flex-wrap items-center gap-1.5">

      {/* STATUS BUTTONS */}
      {statuses.map((status) => (
        <button
          key={status.value}
          type="button"
          onClick={() => onStatusChange(status.value)}
          className={`inline-flex h-8 items-center justify-center rounded-md px-2.5 text-[11px] font-semibold transition cursor-pointer ${
            selectedStatus === status.value
              ? "bg-slate-900 text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          {status.label ?? status.value}
        </button>
      ))}

      {/* RESET */}
      <button
        type="button"
        onClick={handleReset}
        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
      >
        <RotateCcw className="h-3 w-3" />
        {resetLabel}
      </button>

      {/* ACTION MENU */}
      <div className="ml-1 flex items-center justify-end">
        <ActionMenu
          orientation="horizontal"
          title="Actions"
          items={actions}
        />
      </div>

    </div>

  </div>
</div>
  );
}