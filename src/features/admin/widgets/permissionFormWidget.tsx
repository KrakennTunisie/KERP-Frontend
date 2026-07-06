import { getCategoryLabel } from "../helpers/categoryHelper";
import { Permission } from "../mocks/mock-permission";

export type PermissionFormWidgetProps = {
    selected: Permission[]|[],
    permission: Permission,
    togglePermission : (permission: Permission)=> void;

}

export default function PermissionFormWidget({selected, permission, togglePermission}:PermissionFormWidgetProps) {
  const isSelected = selected.some((p) => p.key === permission.key);
  
    return (
    <button
        key={permission.key}
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
                {permission.label}
            </p>

            </div>

        </div>

        {/* CATEGORY BADGE */}
        <span
            className={`
            shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold border
            ${
                isSelected
                ? "bg-blue-100 text-blue-700 border-blue-200"
                : "bg-slate-50 text-slate-500 border-slate-200"
            }
            `}
        >
            {getCategoryLabel(permission.category)}
        </span>
        </div>

    </button>
    );
}
