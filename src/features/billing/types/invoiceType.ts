import { z } from "zod";


export const invoiceTypeSchema = z.enum(["PURCHASE", "SALE","CREDITNOTE"]);
export type InvoiceType = z.infer<typeof invoiceTypeSchema>;


export const invoiceTypeLabels: Record<InvoiceType, string> = {
  PURCHASE:"Achat",
  SALE:"Vente",
  CREDITNOTE :"Avoir"

};