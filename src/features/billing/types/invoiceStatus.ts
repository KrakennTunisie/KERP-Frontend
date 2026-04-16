import { z } from "zod";


export const invoiceStatusSchema = z.enum([
  "ALL",
  "DRAFT",
  "TO_PAY",
  "TO_COLLECT",
  "PAID",
  "CANCELLED",
  "REFUNDED",
  "NOT_REFUNDED",
]);

export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;

/* ================================
   2. LABELS (UI - FRENCH)
================================ */
export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  ALL: "TOUTES",
  DRAFT: "BROUILLON",
  TO_PAY: "À PAYER",
  TO_COLLECT: "À ENCAISSER",
  PAID: "PAYÉE",
  CANCELLED: "ANNULÉE",
  REFUNDED: "REMBOURSÉE",
  NOT_REFUNDED: "NON REMBOURSÉE",
};

/* ================================
   3. COLORS (UI)
================================ */
export const invoiceStatusColors: Record<
  Exclude<InvoiceStatus, "ALL">,
  string
> = {
  DRAFT: "bg-slate-100 text-slate-600 border border-slate-200",
  TO_PAY: "bg-blue-100 text-blue-700 border border-blue-200",
  TO_COLLECT: "bg-amber-100 text-amber-700 border border-amber-200",
  PAID: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  CANCELLED: "bg-red-100 text-red-700 border border-red-200",
  REFUNDED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  NOT_REFUNDED: "bg-red-100 text-red-700 border border-red-200",
};

