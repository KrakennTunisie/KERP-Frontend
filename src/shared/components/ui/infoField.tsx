type InfoFieldProps = {
  label: string;
  value?: React.ReactNode;
  breakWords?: boolean;
};

export default function InfoField({
  label,
  value,
  breakWords = false,
}: InfoFieldProps) {
  return (
    <div className="min-w-0">

      <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`text-xs font-medium text-slate-900 ${
          breakWords ? "break-words" : "truncate"
        }`}
      >
        {value ?? "-"}
      </p>

    </div>
  );
}