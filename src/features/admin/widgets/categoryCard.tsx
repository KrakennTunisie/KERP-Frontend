import { Plus, ShieldCheck } from "lucide-react";
import { getCategoryLabel } from "../helpers/categoryHelper";
import { Permission } from "../mocks/mock-permission";

export type CategoryCardProps={
    category: string,
    permissions: Permission[]|[],
    setSelectedPermission: (permission: Permission)=>void;
    setOpen:(status: boolean)=>void;
    handleOpenAdd: (category: string)=> void
}


export default function CategoryCard({category, permissions, setSelectedPermission, setOpen, handleOpenAdd}:CategoryCardProps) {
  return (
        <div
          key={category}
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
                    {getCategoryLabel(category)}
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

                <button
                onClick={() => handleOpenAdd(category)}
                className="
                    h-7
                    px-1.5
                    rounded-lg
                    bg-blue-500
                    text-white
                    text-sm
                    font-medium
                    flex
                    items-center
                    cursor-pointer
                    transition-all
                    hover:bg-blue-700
                    hover:shadow-sm
                "
                >
                <Plus className="h-4 w-4" />
                </button>
            </div>

        </div>

          {/* PERMISSIONS */}
          <div className="flex flex-wrap gap-2">

            {permissions.map((permission) => (
              <div
                key={permission.key}
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
                  {permission.label}
                </p>

                <p className="text-[10px] text-slate-400">
                  {permission.key}
                </p>
              </div>
            ))}

          </div>

        </div>
  )
}
