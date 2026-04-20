import {  InvoiceEventSourceSchema } from '../types/invoiceEventSource'
import {  InvoiceEventTypeSchema } from '../types/invoiceEventType'
import {  z } from "zod";


export const InvoiceEventSchema = z.object({
  idInvoiceEvent: z.uuid(),
  invoiceEventType: InvoiceEventTypeSchema,
  eventDate: z.date(),
  description: z.string(),
  eventTrigger: InvoiceEventSourceSchema,
  triggeredBy: z.string()
})

export const InvoiceCreditNoteEventSchema = z.object({
  idInvoiceEvent: z.uuid(),
  invoiceCreditNoteEventType: InvoiceEventTypeSchema,
  eventDate: z.date(),
  description: z.string(),
  eventTrigger: InvoiceEventSourceSchema,
  triggeredBy: z.string()
})

export type InvoiceCreditNoteEvent = z.infer<typeof InvoiceEventSchema>

export type InvoiceEvent = z.infer<typeof InvoiceEventSchema>
