
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
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-xl ring-1 flex items-center justify-center shadow-sm ${iconWrapperClassName}`}
          >
            <Icon className={`w-5 h-5 ${iconClassName}`} />
          </div>

          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {label}
          </p>
        </div>

        <p className="text-xl font-bold text-gray-900 tracking-tighter">
          {value}
          {suffix && (
            <span className="text-sm font-semibold text-gray-400 ml-1">
              {suffix}
            </span>
          )}
        </p>

        {helperText && (
          <p
            className={`text-[10px] font-bold uppercase mt-1 tracking-tight ${helperClassName}`}
          >
            {helperText}
          </p>
        )}
      </CardContent>
    </Card>
  );
}