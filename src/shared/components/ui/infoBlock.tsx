export function InfoBlock({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="truncate text-xs font-medium text-gray-900">
        {value ?? "—"}
      </p>
    </div>
  );
}