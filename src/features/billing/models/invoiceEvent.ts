import { InvoiceEventSource } from '../types/invoiceEventSource'
import { InvoiceEventType } from '../types/invoiceEventType'
import { Invoice } from './invoice'

export interface InvoiceEvent {
  idInvoiceEvent: string        
  invoice: Invoice              
  invoiceEventType: InvoiceEventType
  eventDate: Date
  description: string
  eventSource:InvoiceEventSource
}