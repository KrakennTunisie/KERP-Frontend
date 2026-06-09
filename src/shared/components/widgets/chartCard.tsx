export function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold tracking-tight text-slate-900">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}