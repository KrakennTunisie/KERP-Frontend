import { z } from "zod";


export const invoiceStatusSchema = z.enum([
  "ALL",
  "DRAFT",
  "TO_PAY",
  "TO_COLLECT",
  "PARTIALLY_PAID",
  "PAID",
  "OVERDUE",
  "CANCELLED",
  "REFUNDED",
  "NOT_REFUNDED",
  "IN_PROGRESS"
]);

export const invoiceStatusSchemaWithoutAll = z.enum([
  "DRAFT",
  "TO_PAY",
  "TO_COLLECT",
  "PARTIALLY_PAID",
  "PAID",
  "OVERDUE",
  "CANCELLED",
  "REFUNDED",
  "NOT_REFUNDED",
  "IN_PROGRESS"
]);

export type InvoiceStatusWithoutAll = z.infer<typeof invoiceStatusSchemaWithoutAll>;


export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;


export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  ALL: "TOUTES",
  DRAFT: "BROUILLON",
  TO_PAY: "À PAYER",
  TO_COLLECT: "À ENCAISSER",
  PARTIALLY_PAID : "PAYÉE PARTIELLEMENT",
  PAID: "PAYÉE",
  OVERDUE: "EN RETARD",
  CANCELLED: "ANNULÉE",
  REFUNDED: "REMBOURSÉE",
  NOT_REFUNDED: "NON REMBOURSÉE",
  IN_PROGRESS: "En cours",
};

export const invoiceStatusColors: Record<
  Exclude<InvoiceStatus, "ALL">,
  string
> = {
  DRAFT: "bg-slate-100 text-slate-600 border border-slate-200",
  TO_PAY: "bg-blue-100 text-blue-700 border border-blue-200",
  TO_COLLECT: "bg-amber-100 text-amber-700 border border-amber-200",
  PARTIALLY_PAID: "bg-indigo-100 text-indigo-700 border border-indigo-200",
  PAID: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  OVERDUE:"bg-red-100 text-red-700 border border-red-200",
  CANCELLED: "bg-red-100 text-red-700 border border-red-200",
  REFUNDED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  NOT_REFUNDED: "bg-red-100 text-red-700 border border-red-200",
  IN_PROGRESS: "bg-indigo-100 text-indigo-700 border border-indigo-200",
};

export const CLIENT_INVOICES_STATUS_PASSAGE_POLICY: Record<InvoiceStatus, InvoiceStatus[]> = {
  DRAFT: [ "TO_COLLECT", "CANCELLED"],
  TO_PAY: [],
  TO_COLLECT: ["PAID", "CANCELLED"],
  PARTIALLY_PAID: ["PARTIALLY_PAID","PAID", "CANCELLED"],
  PAID: [],
  OVERDUE:["PARTIALLY_PAID","PAID", "CANCELLED"],
  CANCELLED: [],
  ALL: [],
  REFUNDED: [],
  NOT_REFUNDED: [],
  IN_PROGRESS: ["PAID"]
};

export const SUPPLIER_STATUS_PASSAGE_POLICY: Record<InvoiceStatus, InvoiceStatus[]> = {
  DRAFT: ["TO_PAY", "CANCELLED"],
  TO_PAY: ["PAID", "CANCELLED"],
  TO_COLLECT: [],
  PARTIALLY_PAID: ["PARTIALLY_PAID","PAID", "CANCELLED"],
  PAID: [],
  OVERDUE:[],
  CANCELLED: ["PARTIALLY_PAID","PAID"],
  ALL: [],
  REFUNDED: [],
  NOT_REFUNDED: [],
  IN_PROGRESS: ["PAID"]
};

export const CREDIT_NOTE_STATUS_PASSAGE_POLICY: Record<InvoiceStatus, InvoiceStatus[]> = {
  DRAFT: [ "CANCELLED", "IN_PROGRESS"],
  TO_PAY: [],
  TO_COLLECT: [],
  PARTIALLY_PAID: [],
  PAID: [],
  OVERDUE:[],
  CANCELLED: [],
  ALL: [],
  REFUNDED: [],
  NOT_REFUNDED: [],
  IN_PROGRESS: ["REFUNDED","NOT_REFUNDED"]
};

export const getClientInvoiceAllowedNextStatuses = (
  currentStatus: InvoiceStatus
): InvoiceStatus[] => {
  return CLIENT_INVOICES_STATUS_PASSAGE_POLICY[currentStatus] ?? [];
};

export const getCreditNoteAllowedNextStatuses = (
  currentStatus: InvoiceStatus
): InvoiceStatus[] => {
  return CREDIT_NOTE_STATUS_PASSAGE_POLICY[currentStatus] ?? [];
};

export const getSupplierInvoiceAllowedNextStatuses = (
  currentStatus: InvoiceStatus
): InvoiceStatus[] => {
  return SUPPLIER_STATUS_PASSAGE_POLICY[currentStatus] ?? [];
};