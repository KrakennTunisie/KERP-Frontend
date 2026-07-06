"use client";

import { ReactNode, useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, MinusCircle, Trash2, XCircle } from "lucide-react";



export type SettingItem = {
  id: string;
  code: string;
  label: string;
  description: string;
  isActive: boolean;
  badge?: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
};

export type cardProps = {
    onDelete : (selectedItem: SettingItem)=> void;
    onShow: (selectedItem: SettingItem)=> void;
    onToggleActive: (selectedItem: SettingItem)=> void;
    onAction: (type: string)=> void;

}

export type SettingCardProps = {
  title: string;
  type:string;
  description: string;
  icon: ReactNode;
  items: SettingItem[];
  actionLabel: string;
  onAction: (type: string)=> void;
  onShow: (selectedItem: SettingItem)=> void;
  onDelete : (selectedItem: SettingItem)=> void;
  onToggleActive: (selectedItem: SettingItem)=> void;
  footer?: ReactNode;
};

export function SettingCard({
  title,
  type,
  description,
  icon,
  items,
  actionLabel,
  onAction,
  onShow,
  footer,
  onDelete,
  onToggleActive
}: SettingCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">

      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between p-4 text-left"
      >
        <div className="flex gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            {icon}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              {title}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {description}
            </p>

            <p className="mt-2 text-xs font-medium text-slate-400">
              {items.length} configuré(s)
            </p>
          </div>
        </div>

        {open ? (
          <ChevronUp className="mt-1 h-4 w-4 text-slate-500" />
        ) : (
          <ChevronDown className="mt-1 h-4 w-4 text-slate-500" />
        )}
      </button>

      {open && (
        <div className="border-t border-slate-100 px-4 py-4">

              {/* Scrollable list */}
            <div className="max-h-64 overflow-y-auto pr-1 space-y-2">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="
                        group
                        flex items-center justify-between
                        rounded-lg border border-slate-200
                        bg-slate-50
                        px-3 py-2
                        transition
                        hover:border-blue-200 hover:bg-blue-50
                    "
                    >
                    <div className="flex items-center gap-2">
                        <span 
                        onClick={()=>onShow(item)}
                        className="text-sm font-medium
                                            transition-colors
                                            hover:text-blue-700
                                            hover:underline
                                            cursor-pointer">
                        {item.label}
                        </span>

                        {item.badge && (
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                            {item.badge}
                        </span>
                        )}
                    </div>

                    <div
                        className="
                            flex items-center gap-1
                            opacity-0 transition-opacity
                            group-hover:opacity-100
                        "
                        >
                        <button
                            type="button"
                            onClick={() => onToggleActive(item)}
                            className={`
                                cursor-pointer
                                rounded-md p-1
                                transition
                                ${
                                item.isActive
                                    ? "text-rose-400 hover:bg-rose-100 hover:text-rose-600"
                                    : "text-emerald-400 hover:bg-emerald-100 hover:text-emerald-600"
                                }
                            `}
                            title={item.isActive ? "Désactiver" : "Activer"}
                        >
                            {item.isActive ? (
                            <XCircle className="h-4 w-4" />
                            ) : (
                            <CheckCircle2 className="h-4 w-4" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => onDelete(item)}
                            className="
                            cursor-pointer
                            rounded-md p-1
                            text-slate-400
                            hover:bg-rose-100
                            hover:text-rose-600
                            transition
                            "
                            title="Supprimer"
                        >
                            <MinusCircle className="h-4 w-4" />
                        </button>
                 </div>
              </div>
            ))}
            </div>

          {footer}

          <button
            onClick={()=>onAction(type)}
            className="
            cursor-pointer
            inline-flex items-center gap-1.5
            text-[11px] font-semibold
            text-blue-600 hover:text-blue-700
            transition
            "
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}