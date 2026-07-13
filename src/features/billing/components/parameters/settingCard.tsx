"use client";

import { ReactNode, useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, RefreshCw,  XCircle } from "lucide-react";
import { OperationCategory } from "../../models/operationCategory";
import { PaymentCondition} from "../../models/paymentCondition";
import { TVARate} from "../../models/TVArate";
import { SettingType } from "../../types/settingType";
import { SettingPageItem } from "../../models/SettingItem";
import { formatShowLabel, getSettingItemId } from "../../lib/settingItemHelpers";
import PageLoader from "@/shared/components/ui/pageLoader";



export type SettingItem = OperationCategory | PaymentCondition | TVARate

export type cardProps = {
    onShow: (selectedItem: SettingPageItem)=> void;
    onToggleActive: (selectedItem: SettingPageItem)=> void;
    onAction: (type: SettingType)=> void;
    onFetchReady: (refresh: () => Promise<void>) => void;
}


export type SettingCardProps = {
  title: string;
  type:SettingType;
  description: string;
  icon: ReactNode;
  items: SettingPageItem[];
  actionLabel: string;
  onAction: (type: SettingType)=> void;
  onShow: (selectedItem: SettingPageItem)=> void;
  onToggleActive: (selectedItem: SettingPageItem)=> void;
  onRefresh: ()=>void;
  loading: boolean;
  footer?: ReactNode;
  open:boolean;
  setOpen: (op: boolean)=> void;
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
  onRefresh,
  footer,
  loading,
  onToggleActive,
  open= false, 
  setOpen
}: SettingCardProps) {



  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">

    {/* Header */}
    <div className="flex items-start justify-between p-4">
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

    <div className="flex items-center gap-2">
        {/* Refresh */}
        <button
        type="button"
        disabled={!open}
        onClick={onRefresh} // Replace with your refresh handler
        className={`
            rounded-md p-2 transition
            ${
            open
                ? "text-slate-500 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                : "cursor-not-allowed text-slate-300"
            }
        `}
        title="Rafraîchir"
        >
        <RefreshCw className="h-4 w-4" />
        </button>

        {/* Expand / Collapse */}
        <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
        title={open ? "Réduire" : "Développer"}
        >
        {open ? (
            <ChevronUp className="h-4 w-4" />
        ) : (
            <ChevronDown className="h-4 w-4" />
        )}
        </button>
    </div>
    </div>

      {open && (
        <div className="border-t border-slate-100 px-4 py-4">

            {/* Scrollable list */}
            <div className="max-h-64 overflow-y-auto pr-1 space-y-2">

            {/* Loading */}
            {loading && (
                <PageLoader label="Chargement..."/>
            )}

            {/* Empty */}
            {!loading && items.length === 0 && (
                <div
                className="
                    flex flex-col items-center justify-center
                    rounded-lg border border-dashed border-slate-300
                    bg-slate-50
                    py-8
                    text-center
                "
                >
                <p className="text-sm font-medium text-slate-600">
                    Aucun élément trouvé
                </p>

                <p className="mt-1 text-xs text-slate-400">
                    Ajoutez un nouvel élément pour commencer
                </p>
                </div>
            )}

            {/* Data */}
            {!loading &&
                items.map((item) => (
                <div
                    key={getSettingItemId(item)}
                    className={`
                    group
                    flex items-center justify-between
                    rounded-lg border px-3 py-2 transition
                    ${
                        item.active
                        ? "border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-blue-50"
                        : "border-dashed border-slate-300 bg-slate-100 opacity-70 hover:opacity-100"
                    }
                    `}
                >
                    <div className="flex items-center gap-2">
                    <span
                        onClick={() => onShow(item)}
                        className={`
                        text-sm font-medium transition-colors cursor-pointer
                        ${
                            item.active
                            ? "text-slate-900 hover:text-blue-700 hover:underline"
                            : "text-slate-500 line-through hover:text-slate-700"
                        }
                        `}
                    >
                        {formatShowLabel(item.label)}
                    </span>
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
                            item.active
                            ? "text-rose-400 hover:bg-rose-100 hover:text-rose-600"
                            : "text-emerald-400 hover:bg-emerald-100 hover:text-emerald-600"
                        }
                        `}
                        title={item.active ? "Désactiver" : "Activer"}
                    >
                        {item.active ? (
                        <XCircle className="h-4 w-4" />
                        ) : (
                        <CheckCircle2 className="h-4 w-4" />
                        )}
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