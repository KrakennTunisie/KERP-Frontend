import { z } from "zod";
import { invoiceItemSchema } from "./invoiceItem";
import { invoiceSchema } from "./invoice";
import { CreditNoteTypeSchema } from "../types/creditNoteType";
import { invoiceStatusSchema } from "../types/invoiceStatus";
import { invoiceComplianceStatusSchema } from "../types/invoiceComplianceStatus";
import { fileSchema } from "../types/pdfSchema";
import { tvaRateSchema } from "../types/tvaRate";
export const CreditNoteSchema = z.object(
  { 
    invoiceNumber : z.uuid(),
    issueDate : z.date(),
    sentToTTNDate:  z.date().nullable(),
    sentToclientDate:  z.date().nullable(),
    creationDate: z.date().nullable(),
    invoiceStatus : invoiceStatusSchema,
    invoiceComplianceStatus : invoiceComplianceStatusSchema,
    QRCode : z.string(),
    invoiceItems : z.array(invoiceItemSchema).nullable(),
    invoiceDocument : fileSchema.nullable(),
    creditNoteReason: CreditNoteTypeSchema,
    totalExclTax: z.number(),
    totalInclTax: z.number(),
    vatAmount: z.number(),
    originalInvoice : invoiceSchema
  });
export type CreditNote = z.infer<typeof CreditNoteSchema>;