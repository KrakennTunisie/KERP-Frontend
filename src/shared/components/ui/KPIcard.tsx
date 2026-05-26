export function KpiCard({
  color,
  icon,
  title,
  value,
  secondValue,
  footer,
}: {
  color: "blue" | "emerald" | "purple" | "amber";
  icon: React.ReactNode;
  title: string;
  value: string;
  secondValue?: string;
  footer: string;
}) {
  const styles = {
    blue: "bg-blue-600 text-white shadow-blue-100",
    emerald: "bg-emerald-600 text-white shadow-emerald-100",
    purple: "bg-purple-600 text-white shadow-purple-100",
    amber: "bg-amber-500 text-white shadow-amber-100",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          {title}
        </p>

        <div
          className={`
            flex h-10 w-10 shrink-0 items-center justify-center
            rounded-xl shadow-sm
            ring-1 ring-black/5
            [&_svg]:h-5 [&_svg]:w-5
            ${styles[color]}
          `}
        >
          {icon}
        </div>
      </div>

      <div className="space-y-0.5">
        <p className="text-xl font-semibold leading-tight tracking-tight text-slate-900">
          {value}
        </p>

        {secondValue && (
          <p className="text-sm font-medium leading-tight text-slate-600">
            {secondValue}
          </p>
        )}
      </div>

      <p className="mt-3 text-[11px] font-medium leading-snug text-slate-500">
        {footer}
      </p>
    </div>
  );
}