import { CheckCircle2, Circle } from "lucide-react";
import { InvoiceStatus } from "../types/invoiceStatus";

export function AmountCell({
  value,
  currency,
}: {
  value?: number | null;
  currency: "EUR" | "TND";
}) {
  return (
    <p className="whitespace-nowrap text-xs font-semibold text-slate-700">
      {value != null ? value.toLocaleString("fr-FR") : "—"}
      <span className="ml-1 text-[11px] font-medium text-slate-400">
        {currency}
      </span>
    </p>
  );
}

export function StatusPill({
  status,
  getStatusLabel,
  getStatusColor,
}: {
  status: InvoiceStatus;
  getStatusLabel: (status: InvoiceStatus) => string;
  getStatusColor: (status: InvoiceStatus) => string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ${getStatusColor(
        status
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
export function ComplianceIcon({ isCompliant }: { isCompliant?: boolean | null }) {
  return (
    <div className="flex justify-center">
      {isCompliant ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      ) : (
        <Circle className="h-4 w-4 text-slate-300" />
      )}
    </div>
  );
}
