import { z } from "zod";
import { baseInvoiceCreditNoteItemSchema, creditNoteItemSchema } from "./invoiceItem";
import { CreditNoteTypeSchema } from "../types/creditNoteType";
import { invoiceComplianceStatusSchema } from "../types/invoiceComplianceStatus";
import { invoiceStatusSchema } from "../types/invoiceStatus";
import { fileSchema } from "../types/pdfSchema";
import { documentSchema } from "./document";
import { invoiceDetailedSummarySchema, invoiceSchema } from "./invoice";
import { InvoiceCreditNoteEventSchema } from "./invoiceEvent";

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
  invoiceCreditNoteStatus: invoiceStatusSchema.nonoptional(),
  invoiceCreditNoteComplianceStatus: invoiceComplianceStatusSchema.nullable(),
  QRCode: z.string(),
  totalExclTax: z.number(),
  totalInclTax: z.number(),
  vatAmount: z.number(),
  invoice: invoiceDetailedSummarySchema,
  invoiceCreditNoteEvents: z.array(InvoiceCreditNoteEventSchema).nullable(),
  invoiceCreditNoteDocument: documentSchema,
  totalExclTaxEUR: z.number(),
  totalInclTaxEUR: z.number(),
  totalExclTaxTND: z.number(),
  totalInclTaxTND: z.number(),  
  totalExclTaxUSD: z.number(),
  totalInclTaxUSD: z.number(),
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
  creditNoteItems: z.array(creditNoteItemSchema).nullable(),
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
  comment: z.string()
});

/**
 * InvoiceCreditNoteCreate
 * originalInvoiceId, invoiceCreditNoteNumber, motif, description,
 * invoiceCreditNoteDocument, invoiceItems
 */
export const invoiceCreditNoteCreateSchema = z.object({
  originalInvoice: z.any(),
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
  creditNoteItems: z.array(creditNoteItemSchema).nullable(),
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
  totalExclTaxEUR: z.number(),
  totalInclTaxEUR: z.number(),
  totalExclTaxTND: z.number(),
  totalInclTaxTND: z.number(),
  totalExclTaxUSD: z.number(),
  totalInclTaxUSD: z.number(),
  invoice: invoiceDetailedSummarySchema
});


/**
 * Types TS
 */
export type InvoiceCreditNoteDetails = z.infer<typeof detailsInvoiceCreditNoteItemSchema>
export type InvoiceCreditNote = z.infer<typeof invoiceCreditNoteSchema>;
export type InvoiceCreditNoteCreate = z.infer<typeof invoiceCreditNoteCreateSchema>;
export type InvoiceCreditNotePageItem = z.infer<typeof invoiceCreditNotePageItemSchema>;