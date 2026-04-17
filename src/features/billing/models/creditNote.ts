import { z } from "zod";
import { invoiceItemSchema } from "./invoiceItem";
import { Invoice, invoiceSchema, invoiceSummarySchema } from "./invoice";
import { CreditNoteTypeSchema } from "../types/creditNoteType";
import { invoiceStatusSchema } from "../types/invoiceStatus";
import { invoiceComplianceStatusSchema } from "../types/invoiceComplianceStatus";
import { fileSchema } from "../types/pdfSchema";
import { uuid4 } from "node_modules/zod/v4/core/regexes.cjs";
import { _uuidv4 } from "node_modules/zod/v4/core/api.cjs";
import { InvoiceEventSchema } from "./invoiceEvent";
import { documentSchema } from "./document";

const baseInvoiceCreditNoteItemSchema= z.object({
    idInvoiceCreditNoteItem: z.string(),
    invoiceCreditNote: z.string().nullable(),
    invoiceItem: invoiceItemSchema,
    quantity: z.number()
})

const detailsInvoiceCreditNoteItemSchema = z.object({
  invoiceCreditNoteNumber: z.string(),
  issueDate: z.date(),
  motif: CreditNoteTypeSchema,
  description: z.string(),
  invoiceCreditNoteItems: z.array(baseInvoiceCreditNoteItemSchema).nullable(),
  total: z.number(),
  idInvoiceCreditNote: z.string(),
  sentToTTNDate: z.date().nullable(),
  sentToclientDate: z.date().nullable(),
  creationDate: z.date().nullable(),
  invoiceCreditNoteStatus: invoiceStatusSchema,
  invoiceCreditNoteComplianceStatus: invoiceComplianceStatusSchema.nullable(),
  QRCode: z.string(),
  totalExclTax: z.number(),
  totalInclTax: z.number(),
  vatAmount: z.number(),
  invoice: invoiceSchema,
  invoiceCreditNoteEvents: z.array(InvoiceEventSchema).nullable(),
  invoiceCreditNoteDocument: documentSchema,
})

/**
 * Base commune Credit Note
 */
const baseInvoiceCreditNoteSchema = z.object({
  invoiceCreditNoteNumber: z.string(),
  issueDate: z.date(),
  motif: CreditNoteTypeSchema,
  description: z.string().nullable(),
  invoiceCreditNoteDocument: fileSchema.nullable(),
  invoiceItems: z.array(invoiceItemSchema).nullable(),
  total: z.number(),
});

/**
 * Modèle complet InvoiceCreditNote
 */
export const invoiceCreditNoteSchema = baseInvoiceCreditNoteSchema.extend({
  idInvoiceCreditNote: z.string(),
  sentToTTNDate: z.date().nullable(),
  sentToclientDate: z.date().nullable(),
  creationDate: z.date().nullable(),
  invoiceCreditNoteStatus: invoiceStatusSchema,
  invoiceCreditNoteComplianceStatus: invoiceComplianceStatusSchema.nullable(),
  QRCode: z.string(),
  totalExclTax: z.number(),
  totalInclTax: z.number(),
  vatAmount: z.number(),
  originalInvoice: invoiceSchema,
});

/**
 * InvoiceCreditNoteCreate
 * originalInvoiceId, invoiceCreditNoteNumber, motif, description,
 * invoiceCreditNoteDocument, invoiceItems
 */
export const invoiceCreditNoteCreateSchema = z.object({
  originalInvoice: z.any() ,
  invoiceCreditNoteNumber: z.string(),
  motif: CreditNoteTypeSchema,
  description: z.string().nullable(),
  sentToTTNDate: z.date().nullable(),
  sentToclientDate: z.date().nullable(),
  creationDate: z.date().nullable(),
  invoiceCreditNoteStatus: invoiceStatusSchema,
  invoiceCreditNoteComplianceStatus: invoiceComplianceStatusSchema.nullable(),
  QRCode: z.string(),
  totalExclTax: z.number(),
  totalInclTax: z.number(),
  vatAmount: z.number(),
  invoiceCreditNoteDocument: fileSchema.nullable(),
  invoiceItems: z.array(invoiceItemSchema).nullable(),
  issueDate: z.date(),
});

/**
 * InvoiceCreditNotePageItem
 * idInvoiceCreditNote, invoiceCreditNoteNumber, issueDate,
 * invoiceCreditNoteStatus, invoiceCreditNoteComplianceStatus, total
 */
export const invoiceCreditNotePageItemSchema = z.object({
  idInvoiceCreditNote: z.string(),
  invoiceCreditNoteNumber: z.string(),
  issueDate: z.date(),
  invoiceCreditNoteStatus: invoiceStatusSchema,
  invoiceCreditNoteComplianceStatus: invoiceComplianceStatusSchema.nullable(),
  motif: CreditNoteTypeSchema,
  total: z.number(),
  invoice: invoiceSummarySchema
});


/**
 * Types TS
 */
export type InvoiceCreditNoteDetails = z.infer<typeof detailsInvoiceCreditNoteItemSchema>
export type InvoiceCreditNote = z.infer<typeof invoiceCreditNoteSchema>;
export type InvoiceCreditNoteCreate = z.infer<typeof invoiceCreditNoteCreateSchema>;
export type InvoiceCreditNotePageItem = z.infer<typeof invoiceCreditNotePageItemSchema>;