import { z } from "zod";
import { invoiceItemSchema } from "./invoiceItem";
import { invoiceSchema } from "./invoice";
import { CreditNoteTypeSchema } from "../types/creditNoteType";
import { invoiceStatusSchema } from "../types/invoiceStatus";
import { invoiceComplianceStatusSchema } from "../types/invoiceComplianceStatus";
import { fileSchema } from "../types/pdfSchema";

/**
 * Base commune Credit Note
 */
const baseInvoiceCreditNoteSchema = z.object({
  invoiceCreditNoteNumber: z.string(),
  issueDate: z.date(),
  motif: CreditNoteTypeSchema,
  description: z.string(),
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
  originalInvoiceId: z.string(),
  invoiceCreditNoteNumber: z.string(),
  motif: CreditNoteTypeSchema,
  description: z.string(),
  invoiceCreditNoteDocument: fileSchema.nullable(),
  invoiceItems: z.array(invoiceItemSchema).nullable(),
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
  total: z.number(),
});

/**
 * Types TS
 */
export type InvoiceCreditNote = z.infer<typeof invoiceCreditNoteSchema>;
export type InvoiceCreditNoteCreate = z.infer<typeof invoiceCreditNoteCreateSchema>;
export type InvoiceCreditNotePageItem = z.infer<typeof invoiceCreditNotePageItemSchema>;