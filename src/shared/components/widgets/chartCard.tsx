export function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[32px] border border-gray-100 bg-gray-50/50 p-6">
      <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-gray-700">
        {title}
      </h3>
      {children}
    </div>
  );
}