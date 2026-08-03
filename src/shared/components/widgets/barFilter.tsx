"use client";

import {
  Search,
  RotateCcw,
  DownloadCloud,
  Download,
  HardDriveDownload,
} from "lucide-react";

import { ActionMenu } from "@/shared/components/ui/actionMenuItem";
import { RoleDTO } from "@/features/admin/models/role";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export type FilterOption<T> = {
  value: T;
  label?: string;
};

type UserFilterBarProps<
  Status extends string
> = {
  search: string;
  onSearchChange: (value: string) => void;

  selectedRole: string;
  onRoleChange: (value: string) => void;
  roleOptions: RoleDTO[];

  selectedStatus: Status;
  onStatusChange: (value: Status) => void;
  statusOptions: FilterOption<Status>[];

  defaultRole: string;
  defaultStatus: Status;

  searchPlaceholder?: string;
  resetLabel?: string;

  onDownloadAll?: () => void;
  onDownloadFiltered?: () => void;
  onDownloadCurrentYear?: () => void;
};

export function UserFilterBar<
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
}: UserFilterBarProps< Status>) {
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
            visible: true
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
            visible: true
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
            visible: true
          },
        ]
      : []),
  ];

  return (
<div className="rounded-xl border border-slate-200 bg-white shadow-sm">
  <div className="flex items-center gap-3 border-b border-slate-100 p-3">

    {/* SEARCH */}
    <div className="relative min-w-0 flex-1">
      <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />

      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        className="
          h-9 w-full rounded-lg
          border border-slate-200
          bg-slate-50
          pl-8 pr-3
          text-[11px] font-medium text-slate-700
          outline-none transition
          placeholder:text-slate-400
          hover:bg-white
          focus:border-blue-300
          focus:bg-white
          focus:ring-2 focus:ring-blue-100
        "
      />
    </div>

{/* FILTERS */}
<div className="flex shrink-0 items-center gap-1.5">

  {/* ROLE */}
  <Select
    value={selectedRole || "Tous"}
    onValueChange={(value) => onRoleChange(value)}
  >
    <SelectTrigger
      className="
        w-[140px]
        rounded-md
        border border-slate-200
        bg-white
        px-2
        text-[10px]
        font-medium
        text-slate-700
        focus:ring-1
        focus:ring-blue-100
      "
    >
      <SelectValue placeholder="Rôle" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem
              key="ALL"
              value="ALL"
              className="text-[12px] px-2 py-1.5"
          >
              {"Sélectionner rôle"}
      </SelectItem>
      {roleOptions.map((role) => (
        <SelectItem
          key={role.name}
          value={role.name}
          className="text-[12px] px-2 py-1.5"
        >
          {role.name ?? ""}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

  {/* STATUS */}
  <Select
    value={selectedStatus}
    onValueChange={(value) =>
      onStatusChange(value as Status)
    }
  >
    <SelectTrigger
      className="
        h-8
        w-[150px]
        rounded-md
        border border-slate-200
        bg-white
        px-2
        text-[10px]
        font-medium
        text-slate-700
        focus:ring-1
        focus:ring-blue-100
      "
    >
      <SelectValue placeholder="Statut" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem
              key="ALL"
              value="ALL"
              className="text-[12px] px-2 py-1.5"
          >
              {"Sélectionner status"}
      </SelectItem>
      {statusOptions.map((status) => (
        <SelectItem
          key={status.value}
          value={status.value}
          className="text-[10px] px-2 py-1.5"
        >
          {status.label ?? status.value}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

  {/* RESET */}
  <button
    type="button"
    onClick={handleReset}
    className="
      inline-flex
      h-8
      shrink-0
      items-center
      justify-center
      gap-1
      rounded-md
      border border-slate-200
      bg-slate-50
      px-2
      text-[10px]
      font-semibold
      text-slate-600
      hover:bg-slate-100
    "
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