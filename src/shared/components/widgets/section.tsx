export function Section({
  icon,
  iconBg,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-xl shadow-sm ring-1 ring-black/5
              [&_svg]:h-5 [&_svg]:w-5
              ${iconBg}
            `}
          >
            {icon}
          </div>

          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-950">
              {title}
            </h2>

            <p className="mt-0.5 text-xs font-medium leading-snug text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <div>{children}</div>
    </section>
  );
}