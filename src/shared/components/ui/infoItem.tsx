"use client";

type InfoItemProps = {
  label: string;
  value?: string | null;
};

export default function InfoItem({ label, value }: InfoItemProps) {
  const isEmpty = !value || value.trim() === "";
  const displayValue = isEmpty ? "Non renseigné" : value;

  return (
    <div className="group relative rounded-2xl border border-slate-100 bg-white px-4 py-3.5 shadow-[0_1px_4px_0_rgb(0,0,0,0.04)] transition-all duration-200 ">

      {/* Accent bar */}

      <p className="mb-0.5 text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p
        className={`truncate text-sm font-semibold leading-snug transition-colors duration-200 ${
          isEmpty
            ? "italic text-slate-300"
            : "text-slate-800 group-hover:text-slate-900"
        }`}
        title={isEmpty ? undefined : displayValue}
      >
        {displayValue}
      </p>
    </div>
  );
}