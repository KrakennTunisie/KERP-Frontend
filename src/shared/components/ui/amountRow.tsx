export function SummaryRow({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs font-bold text-slate-400">
        {label}
      </span>

      <span className="max-w-[180px] truncate text-right text-xs font-black text-slate-800">
        {value || "—"}
      </span>
    </div>
  );
}

export function AmountRow({
  label,
  value,
  currency,
  strong = false,
}: {
  label: string;
  value?: number | null;
  currency: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </span>

      <span
        className={
          strong
            ? "text-base font-black text-slate-950"
            : "text-sm font-bold text-slate-700"
        }
      >
        {value != null ? value +" "+ currency : "—"}
      </span>
    </div>
  );
}

export function InfoCard({
  icon,
  label,
  value,
  tone = "slate",
}: {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  tone?: "slate" | "emerald" | "blue";
}) {
  const toneClasses = {
    slate: "bg-slate-50",
    emerald: "bg-emerald-50/60",
    blue: "bg-blue-50/60",
  };

  return (
    <div
      className={`rounded-2xl border border-slate-100 p-4 ${toneClasses[tone]}`}
    >
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
        {icon}
      </div>

      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-black text-slate-900">
        {value || "—"}
      </p>
    </div>
  );
}

export function AmountLine({
  label,
  value,
  currency,
  strong = false,
}: {
  label: string;
  value?: number | null;
  currency: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </span>

      <span
        className={
          strong
            ? "text-base font-black text-slate-950"
            : "text-sm font-bold text-slate-700"
        }
      >
        {value != null ? value : "—"}
      </span>
    </div>
  );
}

export function MiniInfo({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-bold text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}