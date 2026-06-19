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
  title,
  description,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  action,
}: PageHeaderProps) {
  return (
<header className="border-b border-slate-100 bg-white px-5 py-4">
  <div className="mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

    {/* Title */}
    <div className="min-w-0">
      <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
        {title}
      </h1>

      {description && (
        <p className="mt-0.5 text-xs font-medium text-slate-500">
          {description}
        </p>
      )}
    </div>

    {/* Action */}
    <div className="shrink-0">
      {action
        ? action
        : actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-black"
            >
              {ActionIcon && <ActionIcon className="h-4 w-4" />}
              {actionLabel}
            </button>
          )}
    </div>

  </div>
</header>
  );
}