import { Plus, ShieldCheck } from "lucide-react";
import { getCategoryLabel } from "../helpers/categoryHelper";
import { ClientPermissions, Permission } from "../models/permission";

export type CategoryCardProps={
    category: ClientPermissions,
    permissions: Permission[]|[],
    setSelectedPermission: (permission: Permission)=>void;
    setOpen:(status: boolean)=>void;
}


export default function CategoryCard({category, permissions, setSelectedPermission, setOpen}:CategoryCardProps) {
  return (
        <div
          key={category.clientId}
          className="
            group rounded-2xl
            border border-slate-200
            bg-white
            p-5
            shadow-sm
            transition
            hover:shadow-md
          "
        >

          {/* HEADER */}
        <div className="mb-4 flex items-center justify-between">

        {/* Left */}
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                <h2 className="text-sm font-bold text-slate-900">
                    {category.clientId}
                </h2>

                <p className="text-xs text-slate-500">
                    Gestion des permissions
                </p>
                </div>
            </div>

        {/* Right */}
            <div className="flex items-center gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {permissions.length} 
                </span>
            </div>

        </div>

          {/* PERMISSIONS */}
          <div className="flex flex-wrap gap-2">

            {permissions.map((permission) => (
              <div
                key={permission.name}
                onClick={() => {
                  setSelectedPermission(permission);
                  setOpen(true);
                }}
                className="
                  cursor-pointer
                  rounded-lg
                  border border-slate-200
                  bg-slate-50
                  px-2.5 py-1.5
                  transition
                  hover:border-blue-200
                  hover:bg-blue-50
                "
              >
                <p className="text-[11px] font-semibold text-slate-800">
                  {permission.name}
                </p>

                <p className="text-[10px] text-slate-400">
                  {permission.description}
                </p>
              </div>
            ))}

          </div>

        </div>
  )
}
