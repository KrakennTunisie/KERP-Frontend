"use client";

import {
  Search,
  RotateCcw,
  DownloadCloud,
  Download,
  HardDriveDownload,
} from "lucide-react";

import { ActionMenu } from "@/shared/components/ui/actionMenuItem";

export type FilterOption<T extends string> = {
  value: T;
  label?: string;
};

type UserFilterBarProps<
  Role extends string,
  Status extends string
> = {
  search: string;
  onSearchChange: (value: string) => void;

  selectedRole: Role;
  onRoleChange: (value: Role) => void;
  roleOptions: FilterOption<Role>[];

  selectedStatus: Status;
  onStatusChange: (value: Status) => void;
  statusOptions: FilterOption<Status>[];

  defaultRole: Role;
  defaultStatus: Status;

  searchPlaceholder?: string;
  resetLabel?: string;

  onDownloadAll?: () => void;
  onDownloadFiltered?: () => void;
  onDownloadCurrentYear?: () => void;
};

export function UserFilterBar<
  Role extends string,
  Status extends string
>({
  search,
  onSearchChange,

  selectedRole,
  onRoleChange,
  roleOptions,

  selectedStatus,
  onStatusChange,
  statusOptions,

  defaultRole,
  defaultStatus,

  searchPlaceholder = "Rechercher un utilisateur...",
  resetLabel = "Réinitialiser",

  onDownloadAll,
  onDownloadFiltered,
  onDownloadCurrentYear,
}: UserFilterBarProps<Role, Status>) {
  const handleReset = () => {
    onSearchChange("");
    onRoleChange(defaultRole);
    onStatusChange(defaultStatus);
  };

  const actions = [
    ...(onDownloadAll
      ? [
          {
            label: "Exporter tous les utilisateurs",
            icon: DownloadCloud,
            color: "text-amber-600",
            hover: "hover:bg-amber-50",
            onClick: onDownloadAll,
          },
        ]
      : []),

    ...(onDownloadFiltered
      ? [
          {
            label: "Exporter filtrés",
            icon: Download,
            color: "text-emerald-600",
            hover: "hover:bg-emerald-50",
            onClick: onDownloadFiltered,
          },
        ]
      : []),

    ...(onDownloadCurrentYear
      ? [
          {
            label: "Exporter année courante",
            icon: HardDriveDownload,
            color: "text-violet-600",
            hover: "hover:bg-violet-50",
            onClick: onDownloadCurrentYear,
          },
        ]
      : []),
  ];

  return (
<div className="rounded-xl border border-slate-200 bg-white shadow-sm">

  <div className="flex flex-col gap-2 p-3 border-b border-slate-100 lg:flex-row lg:items-center lg:justify-between">

    {/* SEARCH */}
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />

      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-[11px] font-medium text-slate-700 outline-none transition placeholder:text-slate-400 hover:bg-white focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
      />
    </div>

    {/* FILTERS */}
    <div className="flex flex-wrap items-center gap-1.5">

      {/* ROLE */}
      <select
        value={selectedRole}
        onChange={(e) => onRoleChange(e.target.value as Role)}
        className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
      >
        {roleOptions.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label ?? role.value}
          </option>
        ))}
      </select>

      {/* STATUS */}
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value as Status)}
        className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
      >
        {statusOptions.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label ?? status.value}
          </option>
        ))}
      </select>

      {/* RESET */}
      <button
        type="button"
        onClick={handleReset}
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-100"
      >
        <RotateCcw className="h-3 w-3" />
        {resetLabel}
      </button>

      {/* ACTIONS */}
      {actions.length > 0 && (
        <ActionMenu
          orientation="horizontal"
          title="Actions"
          items={actions}
        />
      )}
    </div>
  </div>
</div>
  );
}