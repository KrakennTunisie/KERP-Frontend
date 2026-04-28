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
    <section className="rounded-[40px] border border-gray-100 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}>
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tighter text-gray-900">
            {title}
          </h2>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            {subtitle}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}