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
<div
  className="
    rounded-xl border border-slate-200 bg-white
    p-3 shadow-sm
    transition-colors
    hover:border-slate-300 hover:bg-slate-50
  "
>
  {/* Header */}
  <div className="mb-2 flex items-center justify-between gap-3">

    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {title}
      </p>
    </div>

    <div
      className={`
        flex h-8 w-8 shrink-0 items-center justify-center
        rounded-lg ring-1 ring-black/5
        [&_svg]:h-4 [&_svg]:w-4
        ${styles[color]}
      `}
    >
      {icon}
    </div>
  </div>

  {/* Main value */}
  <div>
    <p className="text-lg font-semibold leading-none text-slate-900">
      {value}
    </p>

    {secondValue && (
      <p className="mt-1 text-xs font-medium text-slate-500">
        {secondValue}
      </p>
    )}
  </div>

  {/* Footer */}
  <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
    {footer}
  </p>
</div>
  );
}