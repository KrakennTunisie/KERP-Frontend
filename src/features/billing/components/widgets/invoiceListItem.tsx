import { Badge } from "@/shared/components/ui/badge";
import RowActions from "./rowActions";
import { formatDateLong } from "@/shared/utils/formatDate";
import { InvoicePageItem } from "../../models/invoice";

type InvoiceListItemProps = {
  invoice:InvoicePageItem
  currency?: string;
  onOpen?: (invoiceId: string) => void;
  onEdit?: (invoiceId: string) => void;
  onDelete?: (invoiceId: string) => void;
  getStatusIcon: (status: string) => React.ElementType;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export default function InvoiceListItem({
  invoice,
  currency = "TND",
  onOpen,
  onEdit,
  onDelete,
  getStatusIcon,
  getStatusColor,
  getStatusLabel,
}: InvoiceListItemProps) {
  const StatusIcon = getStatusIcon(invoice.invoiceStatus);

  const isPaid = invoice.invoiceStatus === "PAID";

  return (
    <div className="flex items-center justify-between gap-4 p-3.5 bg-slate-50/60 rounded-xl hover:bg-slate-100/60 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isPaid ? "bg-emerald-50" : "bg-blue-50"
          }`}
        >
          <StatusIcon
            className={`w-4 h-4 ${
              isPaid ? "text-emerald-600" : "text-blue-600"
            }`}
          />
        </div>

        <div className="min-w-0">
          <button
            type="button"
            onClick={() => onOpen?.(invoice.idInvoice)}
            className="text-sm font-black text-blue-600 hover:text-blue-800 hover:underline underline-offset-4 tracking-tight truncate"
          >
            {invoice.invoiceNumber}
          </button>

          <p className="text-[11px] text-slate-400 mt-0.5">
            Échéance : {formatDateLong(invoice.dueDate)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <p className="text-base font-black text-slate-900">
          {invoice.totalExclTaxEUR?.toLocaleString() ?? "—"}
          <span className="text-xs font-semibold text-slate-400 ml-1">
            {currency}
          </span>
        </p>

        <Badge className={getStatusColor(invoice.invoiceStatus)}>
          {getStatusLabel(invoice.invoiceStatus)}
        </Badge>

        <RowActions
          onEdit={() => onEdit?.(invoice.idInvoice)}
          onDelete={() => onDelete?.(invoice.idInvoice)}
        />
      </div>
    </div>
  );
}