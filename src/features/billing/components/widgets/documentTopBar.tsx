import { ActionMenu, ActionMenuItem } from "@/shared/components/ui/actionMenuItem";
import { ReactNode } from "react";

type StatusVariant =
  | "draft"
  | "pending"
  | "success"
  | "danger"
  | "neutral"
  | "info";

type DocumentTopBarProps = {
  documentNumber?: string;
  documentTypeLabel?: string;
  statusLabel?: string;
  statusVariant?: StatusVariant;
  issueDateLabel?: string;
  issueDate?: string;
  dueDateLabel?: string;
  dueDate?: string;
  onBack?: () => void;
  rightContent?: ReactNode;

  actionItems?: ActionMenuItem[];
};

const statusStyles: Record<StatusVariant, string> = {
  draft: "bg-slate-50 text-slate-600 border-slate-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  danger: "bg-rose-50 text-rose-700 border-rose-200",
  neutral: "bg-gray-50 text-gray-600 border-gray-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

export function DocumentTopBar({
  documentNumber,
  documentTypeLabel = "Document",
  statusLabel,
  statusVariant = "neutral",
  issueDateLabel = "Émise le",
  issueDate,
  dueDateLabel = "Échéance le",
  dueDate,
  onBack,
  rightContent,
  actionItems,
}: DocumentTopBarProps) {
  return (
<div className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
  <div className="flex items-center justify-between gap-3">
    <div className="flex min-w-0 items-center gap-3">
      <button
        type="button"
        onClick={onBack}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:-translate-x-0.5 hover:bg-slate-50 hover:text-slate-900"
      >
        <svg
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          viewBox="0 0 24 24"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
      </button>

      <div className="min-w-0">
        <div className="mb-0.5 flex items-center gap-2">
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            {documentTypeLabel}
          </span>

          {statusLabel && (
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusStyles[statusVariant]}`}
            >
              {statusLabel}
            </span>
          )}
        </div>

        <h1 className="truncate text-lg font-bold tracking-[-0.02em] text-slate-950">
          {documentNumber || "-"}
        </h1>

        <p className="mt-0.5 text-[11px] font-medium text-slate-500">
          {issueDateLabel}{" "}
          <span className="font-semibold text-slate-700">
            {issueDate || "-"}
          </span>

          {dueDate && (
            <>
              <span className="mx-1.5 text-slate-300">•</span>
              {dueDateLabel}{" "}
              <span className="font-semibold text-slate-700">
                {dueDate}
              </span>
            </>
          )}
        </p>
      </div>
    </div>

    {(rightContent || actionItems?.length) && (
      <div className="hidden shrink-0 items-center gap-2 md:flex">
        {rightContent}

        {actionItems && actionItems.length > 0 && (
          <ActionMenu
            title="Actions document"
            orientation="horizontal"
            items={actionItems}
          />
        )}
      </div>
    )}
  </div>
</div>
  );
}