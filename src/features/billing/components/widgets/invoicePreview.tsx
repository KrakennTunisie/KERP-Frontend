import { DeepPartial } from "react-hook-form";
import { InvoiceCreate, invoiceSchema } from "../../models/invoice";
import { z } from "zod"
import { paymentMethodLabels } from "../../types/paymentMethod";
import { OperationCategoryLabels } from "../../types/operationCategory";
import { invoiceCreditNoteSchema } from "../../models/creditNote";
import { invoiceTypeLabels, invoiceTypeSchema } from "../../types/invoiceType";
import { creditNoteTypeLabels } from "../../types/creditNoteType";
import { PaymentConditionLabels } from "../../types/paymentCondition";
import { forwardRef } from "react";


export type InvoiceData = DeepPartial<z.infer<typeof invoiceSchema>>;
export type CreditNoteData = DeepPartial<z.infer<typeof invoiceCreditNoteSchema>>;
type InvoicePreviewProps = {
    data: InvoiceCreate | CreditNoteData ;
};
function isCreditNote(data: InvoiceCreate | CreditNoteData): data is CreditNoteData {
    return "invoiceCreditNoteNumber" in data;
}

const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(({ data }, ref) => {
    const isCredit = isCreditNote(data);
    const partner = (isCreditNote(data) ? data.originalInvoice?.partner : data.partner);

    return (
        <div ref={ref} className="flex-1 p-6  bg-white">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden max-w-[820px] mx-auto">

                {/* Invoice Header */}
                <div className="relative p-8 pb-6">
                    {/* Watermark */}
                    <div className="absolute top-6 right-6 opacity-10 pointer-events-none select-none">
                        <p className="text-5xl font-black text-violet-400 rotate-[-15deg] tracking-widest border-4 border-violet-400 px-4 py-1 rounded-xl">
                            TTN/E
                        </p>
                    </div>

                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                                    KRAKENN SARL
                                </h2>
                                <p className="text-xs font-bold text-slate-400 tracking-[0.15em] uppercase mt-0.5">
                                    Services et conseil en informatique
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-black text-slate-900 tracking-tight uppercase">
                                {isCredit ? "FACTURE D'AVOIR" : invoiceTypeLabels[data.invoiceType!]}
                            </p>
                            <div className="mt-2 inline-flex items-center px-4 py-1.5 rounded-lg bg-blue-50 border border-blue-200">
                                <span className="text-sm font-bold text-blue-700">
                                 {"invoiceNumber" in data
                                        ? `N° ${data.invoiceNumber}`
                                        : "invoiceCreditNoteNumber" in data ? `N° ${data.invoiceCreditNoteNumber}`
                                                    : ""
                                        }
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Emitter + Recipient */}
                    <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t border-slate-100">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                                Détails Émetteur
                            </p>
                            <p className="text-sm font-bold text-slate-800">ZONE INDUSTRIELLE KHEIREDDINE</p>
                            <p className="text-sm font-bold text-slate-800">Résidence El-wafa - Lac2,Tunis</p>
                            <p className="text-sm font-bold text-slate-800 mt-1">MF: 1234567/A/M/000</p>
                            <div className="flex items-center gap-4 mt-3">
                                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    hello.tunis@kouka.io
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    +33 00 33 7 67 71 63 54
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                                Destinataire
                            </p>
                            {partner ? (
                                <>
                                    <p className="text-base font-bold text-slate-900">{partner.name}</p>
                                    <p className="text-sm text-slate-500 mt-0.5">{partner.address}</p>
                                    <p className="text-sm font-bold text-black mt-2">{partner.email}</p>
                                </>
                            ) : (
                                <p className="text-sm text-slate-400 italic">Aucun client sélectionné</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Meta info bar */}
                <div className="mx-8 mb-6 grid grid-cols-4 divide-x divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                    {[
                        ...(isCredit
                            ? [{ label: "Réf. facture", value: data.originalInvoice?.invoiceNumber ?? "—" }]
                            : []),
                        { label: "Date d'émission", value: data.issueDate ? new Date(data.issueDate).toLocaleDateString("fr-FR") : "-"},
                        ...(!isCredit
                            ? [{ label: "Échéance", value: data.dueDate ? new Date(data.dueDate).toLocaleDateString("fr-FR") : "-" }]
                            : []),
                        ...(isCredit ? [
                              {label: "Paiement",value: data?.originalInvoice?.paymentCondition? PaymentConditionLabels[data.originalInvoice.paymentCondition]: "—",},
                            { label: "Mode", value:data?.originalInvoice!.paymentMethod ? paymentMethodLabels[data.originalInvoice.paymentMethod] : "—" }] :
                            [{ label: "Paiement", value: PaymentConditionLabels[data!.paymentCondition!] ?? "—" },
                            { label: "Mode", value: paymentMethodLabels[data!.paymentMethod!] ?? "—" },])

                    ].map(({ label, value }) => (
                        <div key={label} className="px-4 py-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                            <p className="text-sm font-bold text-slate-800 mt-1">{value}</p>
                        </div>
                    ))}
                </div>

                {/* Services table */}
                <div className="px-8 mb-6">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-900">
                                <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-3">
                                    Description des prestations
                                </th>
                                <th className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-3">QTÉ</th>
                                <th className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-3">P.U HT</th>
                                <th className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-3">Total HT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.invoiceItems!.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center text-slate-400 italic py-8">
                                        Aucun service ajouté
                                    </td>
                                </tr>
                            ) : (
                                data.invoiceItems?.map((item) => (
                                    <tr key={item!.idInvoiceItem} className="border-b border-slate-50">
                                        <td className="py-4">
                                            <p className="text-sm font-bold text-slate-800">
                                                {item!.description || "—"}
                                            </p>
                                            {isCredit && (
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                   {" Motif de l'avoir : "}{creditNoteTypeLabels[data.motif!] ?? "—"}
                                                </p>
                                            )}
                                            <p className="text-xs text-slate-400 mt-0.5">TVA appliquée : {item!.vatRate}%</p>
                                            <p className="text-xs text-slate-400 mt-0.5">Catégorie : {OperationCategoryLabels[item!.operationCategory!]}</p>
                                        </td>
                                        <td className="text-right text-sm text-slate-600 py-4">{item!.quantity}</td>
                                        <td className="text-right text-sm text-slate-600 py-4">{item!.unityPriceEXclTax!.toFixed(2)}</td>
                                        <td className="text-right text-sm font-bold text-slate-800 py-4">
                                            {item!.itemTotalExclTax!.toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Signature + Totals */}
                <div className="px-8 pb-8 flex items-end gap-8">
                    {/* Signature box */}
                    <div className="flex-1">
                        <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-4">
                                Signature &amp; Cachet
                            </p>
                            <div className="h-20 flex items-center justify-center">
                                <div className="border-2 border-blue-200 rounded-xl px-8 py-3 rotate-[-3deg]">
                                    <p className="text-sm font-bold text-blue-400 tracking-wider">SIGNÉ ÉLECTRONIQUEMENT</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            Document certifié conforme aux normes TTN de la République Tunisienne.
                            <br />
                            Généré le {new Date().toLocaleDateString()} à {new Date().toLocaleTimeString("fr-FR")}
                        </p>
                    </div>

                    {/* Totals */}
                    <div className="w-64 flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Total HT</span>
                            <span className="font-bold text-slate-800">{data.totalExclTax?.toFixed(2)} 
                                {isCredit ? data.originalInvoice?.invoiceCurrency : data.invoiceCurrency}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Total TVA</span>
                            <span className="font-bold text-slate-800">
                                {data.totalInclTax?.toFixed(2)} 
                                {isCredit ? data.originalInvoice?.invoiceCurrency : data.invoiceCurrency}
                            </span>
                        </div>
                        <div className="h-px bg-slate-900 my-1" />
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-700">Total TTC</span>
                            <span className="text-3xl font-black text-slate-700">
                                {data.totalInclTax?.toFixed(2)}{" "}
                                <span className="text-lg">
                                {isCredit ? data.originalInvoice?.invoiceCurrency : data.invoiceCurrency}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
});
InvoicePreview.displayName = "InvoicePreview";

export default InvoicePreview;