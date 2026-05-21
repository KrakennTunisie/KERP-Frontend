import type { ElementType, ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: ElementType;
  onAction?: () => void;
  action?: ReactNode;
};

export function PageHeader({
  eyebrow = "Gestion Commerciale",
  title,
  description,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  action,
}: PageHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-100 px-6 py-5 font-[Inter,system-ui,sans-serif]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {eyebrow && (
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-blue-600 w-1.5 h-1.5 rounded-full" />
              <span className="text-[9px] font-extrabold text-blue-600 uppercase tracking-[0.18em]">
                {eyebrow}
              </span>
            </div>
          )}

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>

          {description && (
            <p className="text-sm text-slate-500 font-medium mt-1">
              {description}
            </p>
          )}
        </div>

        {action
          ? action
          : actionLabel && onAction && (
              <button
                type="button"
                onClick={onAction}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-all font-bold text-xs shadow-lg shadow-slate-200 cursor-pointer shrink-0"
              >
                {ActionIcon && <ActionIcon className="w-4 h-4" />}
                {actionLabel}
              </button>
            )}
      </div>
    </header>
  );
}