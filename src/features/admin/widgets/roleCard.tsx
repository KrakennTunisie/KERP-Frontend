"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp,  Plus, ShieldMinus } from "lucide-react";
import { getCategoryLabel } from "../helpers/categoryHelper";
import { Role } from "../models/role";
import { PermissionDTO } from "../models/permission";

type RoleCardProps = {
    role:Role,
    setSelectedRole: (role: Role)=>void;
    setSelectedPermission: (permission: PermissionDTO)=>void;
    seRevokePermissionModalOpen: (status: boolean)=> void,
    setModalOpen: (status: boolean)=> void;
}
export function RoleCard(
  { role, setSelectedRole, setSelectedPermission,seRevokePermissionModalOpen, setModalOpen }: RoleCardProps
) {
  const [open, setOpen] = useState(false);

const groupedPermissions = useMemo(() => {
  return role.permissions.reduce<Record<string, PermissionDTO[]>>(
    (acc, permission) => {
      acc[permission.clientId] ??= [];
      acc[permission.clientId].push(permission);

      return acc;
    },
    {}
  );
}, [role.permissions]);

  const onAdd = () => {
                setSelectedRole(role);
                setModalOpen(true);
              }

  const onRevoke = (permission: PermissionDTO)=>{
    setSelectedRole(role)
    setSelectedPermission(permission)
    seRevokePermissionModalOpen(true)
  }

  return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">

        {/* HEADER */}
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-start justify-between px-4 py-3"
        >
          <div>
            <p className="text-xs font-semibold text-slate-900 tracking-tight">
              {role.name}
            </p>

            <p className="text-[11px] text-slate-500 mt-0.5">
              {role.description}
            </p>
          </div>

          {open ? (
            <ChevronUp className="h-3.5 w-3.5 text-slate-500" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
          )}
        </button>

        {/* BODY */}
        {open && (
          <div
            className="
              border-t border-slate-100
              px-4 py-3
              space-y-5

              max-h-[260px]
              overflow-y-auto
            "
          >

          {Object.entries(groupedPermissions).map(([clientId, permissions]) => (
            <div key={clientId}>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {getCategoryLabel(clientId)}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {permissions.map((permission) => (
                  <div
                    key={`${permission.name}-${permission.name}`}
                    className="
                      group inline-flex items-center gap-1.5
                      rounded-full border border-slate-200
                      bg-slate-50 px-2.5 py-1
                      text-[11px] font-medium text-slate-700
                      transition
                      hover:border-rose-200 hover:bg-rose-50
                    "
                  >
                    <span className="truncate max-w-[140px]">
                      {permission.name}
                    </span>

                    <button
                      type="button"
                      onClick={() => onRevoke(permission)}
                      className="
                        opacity-0 group-hover:opacity-100
                        cursor-pointer
                        rounded-full p-0.5
                        text-slate-400
                        hover:bg-rose-100 hover:text-rose-600
                        transition
                      "
                      title="Révoquer"
                    >
                      <ShieldMinus className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

            {/* ADD BUTTON */}
            <button
              onClick={onAdd}
              className="
                cursor-pointer
                inline-flex items-center gap-1.5
                text-[11px] font-semibold
                text-blue-600 hover:text-blue-700
                transition
              "
            >
              <Plus className="h-3.5 w-3.5" />
              Ajouter une permission
            </button>

          </div>
        )}
      </div>
  );
}