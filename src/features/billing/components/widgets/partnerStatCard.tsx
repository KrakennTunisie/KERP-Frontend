
import { Card, CardContent } from "@/shared/components/ui/card";

type PartnerStatCardProps = {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
  iconClassName?: string;
  iconWrapperClassName?: string;
  suffix?: string;
  helperText?: React.ReactNode;
  helperClassName?: string;
};

export default function PartnerStatCard({
  label,
  value,
  icon: Icon,
  iconClassName = "text-blue-600",
  iconWrapperClassName = "bg-blue-50 ring-blue-100",
  suffix,
  helperText,
  helperClassName = "text-blue-600",
}: PartnerStatCardProps) {
  return (
<Card className="border-slate-200 shadow-sm">
  <CardContent className="p-4">

    {/* Header */}
    <div className="mb-3 flex items-center gap-2.5">

      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ring-1 shadow-sm ${iconWrapperClassName}`}
      >
        <Icon className={`h-4 w-4 ${iconClassName}`} />
      </div>

      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

    </div>

    {/* Value */}
    <div className="flex items-baseline gap-1">
      <p className="text-lg font-bold tracking-tight text-slate-900">
        {value}
      </p>

      {suffix && (
        <span className="text-xs font-medium text-slate-400">
          {suffix}
        </span>
      )}
    </div>

    {/* Helper */}
    {helperText && (
      <p
        className={`mt-1 text-[10px] font-medium uppercase tracking-wide ${helperClassName}`}
      >
        {helperText}
      </p>
    )}

  </CardContent>
</Card>
  );
}