import { z } from "zod";


export const invoiceTypeSchema = z.enum(["PURCHASE", "SALE"]);
export type InvoiceType = z.infer<typeof invoiceTypeSchema>;