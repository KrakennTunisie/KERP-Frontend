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
    blue: "from-blue-50 to-blue-100/50 border-blue-200 text-blue-900 bg-blue-600",
    emerald:
      "from-emerald-50 to-emerald-100/50 border-emerald-200 text-emerald-900 bg-emerald-600",
    purple:
      "from-purple-50 to-purple-100/50 border-purple-200 text-purple-900 bg-purple-600",
    amber:
      "from-amber-50 to-amber-100/50 border-amber-200 text-amber-900 bg-amber-600",
  };

  const [gradient, , border, text, bg] = styles[color].split(" ");

  return (
    <div className={`rounded-[32px] border bg-gradient-to-br ${gradient} ${border} p-6`}>
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg}`}>
          {icon}
        </div>
        <p className={`text-xs font-black uppercase tracking-widest ${text}`}>
          {title}
        </p>
      </div>

      <p className={`text-2xl font-black tracking-tighter ${text}`}>{value}</p>

      {secondValue && (
        <p className={`text-xl font-black tracking-tighter ${text}`}>
          {secondValue}
        </p>
      )}

      <p className={`mt-2 text-[10px] font-bold uppercase ${text}`}>{footer}</p>
    </div>
  );
}



