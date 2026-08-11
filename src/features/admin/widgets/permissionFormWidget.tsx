import { Permission, PermissionDTO } from "../models/permission";

export type PermissionFormWidgetProps = {
    selected: PermissionDTO[]|[],
    permission: Permission,
    togglePermission : (permission: Permission)=> void;

}

export default function PermissionFormWidget({selected, permission, togglePermission}:PermissionFormWidgetProps) {
  const isSelected = selected.some((p) => p.name === permission.name);
  
    return (
    <button
        key={permission.name}
        type="button"
        onClick={() => togglePermission(permission)}
        className={`
        group w-full text-left rounded-xl border p-3 text-xs
        transition-all duration-200
        flex flex-col justify-between gap-2 min-h-[92px]

        ${
            isSelected
            ? "bg-blue-50 border-blue-200 shadow-sm"
            : "bg-white border-slate-200 hover:bg-slate-50"
        }
        `}
    >

        {/* HEADER ROW */}
        <div className="flex items-start justify-between gap-2">

        {/* TITLE */}
        <div className="flex items-start gap-2">

            {/* SELECTION DOT */}
            <div
            className={`
                mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center
                ${
                isSelected
                    ? "border-blue-500 bg-blue-500"
                    : "border-slate-300 bg-white group-hover:border-slate-400"
                }
            `}
            >
            {isSelected && (
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
            )}
            </div>

            <div>
            <p
                className={`
                font-medium text-xs leading-snug
                ${isSelected ? "text-blue-700" : "text-slate-800"}
                `}
            >
                {permission.name}
            </p>

            </div>

        </div>
        </div>

    </button>
    );
}
