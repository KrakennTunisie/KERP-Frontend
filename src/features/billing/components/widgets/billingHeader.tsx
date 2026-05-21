import Link from "next/link";
import type { ReactNode } from "react";
import { Plus } from "lucide-react";

type BillingPageHeaderProps = {
  title: string;
  description?: string;

  createHref?: string;
  createLabel?: string;

  rightContent?: ReactNode;
};

export function BillingPageHeader({
  title,
  description,
  createHref,
  createLabel,
  rightContent,
}: BillingPageHeaderProps) {
  const showCreateButton = Boolean(createHref && createLabel);

  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-5 font-[Inter,system-ui,sans-serif] md:flex-row md:items-center md:justify-between">
      <div>
        <div className="mb-1.5 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-blue-600">
            Gestion commerciale
          </span>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-[26px]">
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-sm font-medium text-slate-500">
            {description}
          </p>
        )}
      </div>

      {rightContent ? (
        rightContent
      ) : showCreateButton ? (
        <Link
          href={createHref!}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-bold text-white shadow-sm shadow-blue-100 transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          {createLabel}
        </Link>
      ) : null}
    </div>
  );
}