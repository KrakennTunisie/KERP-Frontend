import { DeepPartial } from "react-hook-form";
import { invoiceSchema } from "../../models/invoice";
import { z } from "zod"
import { CreditNoteSchema } from "../../models/creditNote";

type InvoicePreviewProps = {
    data: DeepPartial<z.infer<typeof CreditNoteSchema>>;
};
export default function SummaryOriginalInvoice({data}:InvoicePreviewProps) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100/50 
                rounded-2xl px-6 py-4 border border-red-300 mb-8">

  <div className="flex items-center gap-3 mb-4">
    <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest whitespace-nowrap">
      Facture Originale
    </h3>
    <div className="flex-1 h-px bg-red-200" />
  </div>

  <div className="grid grid-cols-1 md:grid-cols-4 divide-x divide-red-200">

    <div className="pr-5">
      <p className="text-[9px] font-black text-red-300 uppercase tracking-widest mb-1">Numéro</p>
      <p className="text-sm font-black text-red-500">{data.invoiceNumber ?? "—"}</p>
      <p className="text-[10px] text-red-300 mt-0.5">{data.refOriginalInvoice ?? ""}</p>
    </div>

    <div className="px-5">
      <p className="text-[9px] font-black text-red-300 uppercase tracking-widest mb-1">Date d'émission</p>
      <p className="text-sm font-black text-red-900">
        {data.issueDate
          ? new Intl.DateTimeFormat("fr-FR", {
              day: "2-digit", month: "short", year: "numeric",
            }).format(new Date(data.issueDate))
          : "—"}
      </p>
    </div>

    <div className="px-5">
      <p className="text-[9px] font-black text-red-300 uppercase tracking-widest mb-1">Client</p>
      <p className="text-sm font-black text-red-900">{data.partner?.name ?? "—"}</p>
      <p className="text-[10px] text-red-300 mt-0.5">{data.partner?.email ?? ""}</p>
    </div>

    <div className="pl-5">
      <p className="text-[9px] font-black text-red-300 uppercase tracking-widest mb-1">Montant TTC</p>
      <p className="text-base font-black text-red-900 tracking-tight">
        {data.totalInclTax != null
          ? new Intl.NumberFormat("fr-TN").format(data.totalInclTax)
          : "—"}{" "}
        <span className="text-xs font-bold text-red-300">{data.currency ?? ""}</span>
      </p>
    </div>

  </div>
</div>
    );
}