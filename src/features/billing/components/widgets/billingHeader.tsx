import Link from "next/link";
import type { ReactNode } from "react";
import { Plus } from "lucide-react";

type BillingPageHeaderProps = {
  title: string;
  description?: string;

  createHref?: string;      // navigation classique
  createLabel?: string;
  onCreateClick?: () => void; // ouverture modal / action custom

  rightContent?: ReactNode;
};

export function BillingPageHeader({
  title,
  description,
  createHref,
  createLabel,
  onCreateClick,
  rightContent,
}: BillingPageHeaderProps) {
  const showCreateButton = Boolean(createLabel && (createHref || onCreateClick));

  const buttonClasses =
    "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3.5 text-[11px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700";

  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 font-[Inter,system-ui,sans-serif] md:flex-row md:items-center md:justify-between">
      {/* LEFT */}
      <div>
        <div className="mb-1 flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-blue-600" />
          <span className="text-[8.5px] font-bold uppercase tracking-[0.16em] text-blue-600">
            Gestion commerciale
          </span>
        </div>

        <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-[25px]">
          {title}
        </h1>

        {description && (
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            {description}
          </p>
        )}
      </div>

      {/* RIGHT */}
      <div>
        {rightContent ? (
          rightContent
        ) : showCreateButton ? (
          onCreateClick ? (
            <button type="button" onClick={onCreateClick} className={buttonClasses}>
              <Plus className="h-3.5 w-3.5" />
              {createLabel}
            </button>
          ) : (
            <Link href={createHref!} className={buttonClasses}>
              <Plus className="h-3.5 w-3.5" />
              {createLabel}
            </Link>
          )
        ) : null}
      </div>
    </div>
  );
}