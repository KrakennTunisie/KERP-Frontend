"use client";

import {
  Edit,
  Trash2,
  Shield,
  Eye,
  Mail,
  UserX,
  UserCog,
} from "lucide-react";

import { ActionMenu } from "@/shared/components/ui/actionMenuItem";
import { formatDateLong } from "@/shared/utils/formatDate";

export type UserRowVariant = "user" | "admin" | "invited";

type UserTableRowProps<T> = {
  item: T;

  variant: UserRowVariant;

  onView: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onSendInvite?: (item: T) => void;
  onManageRoles?: (item: T) => void;

  getId: (item: T) => string;
  getFullName: (item: T) => string;
  getEmail: (item: T) => string;
  getRole?: (item: T) => string | null | undefined;
  getStatus?: (item: T) => string | null | undefined;
  getStatusColor?:(item: T) => string | null | undefined;
  getRoleColor?:(item: T) => string | null | undefined;
  getCreatedAt?: (item: T) => Date | undefined;
};

export function UserTableRow<T>({
  item,
  variant,

  onView,
  onEdit,
  onDelete,
  onSendInvite,
  onManageRoles,

  getId,
  getFullName,
  getEmail,
  getRole,
  getStatus,
  getRoleColor,
  getStatusColor,
  getCreatedAt,
}: UserTableRowProps<T>) {

  const actions = [

    ...(onEdit
      ? [{
          label: "Modifier",
          icon: Edit,
          color: "text-amber-600",
          hover: "hover:bg-amber-50",
          onClick: () => onEdit(item),
        }]
      : []),

    ...(onManageRoles
      ? [{
          label: "Modifier Rôle",
          icon: UserCog,
          color: "text-violet-600",
          hover: "hover:bg-violet-50",
          onClick: () => onManageRoles(item),
        }]
      : []),

    ...(onSendInvite
      ? [{
          label: "Envoyer invitation",
          icon: Mail,
          color: "text-emerald-600",
          hover: "hover:bg-emerald-50",
          onClick: () => onSendInvite(item),
        }]
      : []),

    ...(onDelete
      ? [{
          label: "Bloquer",
          icon: UserX,
          color: "text-rose-600",
          hover: "hover:bg-rose-50",
          onClick: () => onDelete(item),
        }]
      : []),
  ];

  return (
<tr className="transition-colors hover:bg-slate-50/60 text-[11px]">

  {/* USER NAME */}
  <td className="px-4 py-3">
    <button
      onClick={() => onView(item)}
      className="text-[11px] font-semibold cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
    >
      {getFullName(item)}
    </button>
  </td>

  {/* EMAIL */}
  <td className="px-4 py-3">
    <p className="text-[11px] font-medium text-slate-600 truncate max-w-[200px]">
      {getEmail(item)}
    </p>
  </td>

  {/* ROLE */}
  <td className="px-4 py-3">
    {getRole?.(item) && getRoleColor?.(item) ? (
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${getRoleColor(item)}`}
      >
        {getRole(item)}
      </span>
    ) : (
      <span className="text-[11px] text-slate-400">—</span>
    )}
  </td>

  {/* STATUS */}
  <td className="px-4 py-3">
    {getStatus?.(item) && getStatusColor?.(item) ? (
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusColor(item)}`}
      >
        {getStatus(item)}
      </span>
    ) : (
      <span className="text-[11px] text-slate-400">—</span>
    )}
  </td>

  {/* CREATED AT */}
  <td className="px-4 py-3">
    <p className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
      {formatDateLong(getCreatedAt?.(item))}
    </p>
  </td>

  {/* ACTIONS */}
  <td className="px-4 py-3">
    <div className="flex items-center justify-end">
      <ActionMenu
        orientation="horizontal"
        title="Actions"
        items={actions}
      />
    </div>
  </td>

</tr>
  );
}