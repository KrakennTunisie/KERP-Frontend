import { z } from "zod";


export const invoiceStatusSchema = z.enum(["DRAFT", "TO_PAY", "TO_COLLECT", "PAID", "CANCELLED"]);
export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;