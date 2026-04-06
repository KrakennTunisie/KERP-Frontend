import { z } from "zod";


export const invoiceStatusSchema = z.enum(["TOUTES","BROULLION", "À PAYER", "À ENCAISSER", "PAYÉE", "ANNULÉE","REMBOURSÉE", "NON REMBOURSÉE"]);
export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;
export const invoiceStatusColors: Record<Exclude<InvoiceStatus, "TOUTES">, string> = {
     BROULLION:     "bg-slate-100 text-slate-600 border border-slate-200",
    "À PAYER":     "bg-blue-100 text-blue-700 border border-blue-200",
    "À ENCAISSER":   "bg-amber-100 text-amber-700 border border-amber-200",
    PAYÉE:         "bg-emerald-100 text-emerald-700 border border-emerald-200",
    ANNULÉE:       "bg-red-100 text-red-700 border border-red-200",
    REMBOURSÉE :   "bg-emerald-100 text-emerald-700 border border-emerald-200",
    "NON REMBOURSÉE" : "bg-red-100 text-red-700 border border-red-200",
};