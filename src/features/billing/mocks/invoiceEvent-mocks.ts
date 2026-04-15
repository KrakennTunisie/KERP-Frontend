// mocks/invoice-event.mock.ts
import { InvoiceEvent } from '../models/invoiceEvent'

export const mockInvoiceEvent: InvoiceEvent = {
  idInvoiceEvent: '123e4567-e89b-12d3-a456-426614174000',
  invoiceEventType: 'CREATED',
  eventDate: new Date('2025-01-15T10:30:00'),
  description: 'Facture créée',
  eventTrigger: 'SYSTEM',
  triggeredBy: ''
}

export const mockInvoiceEvents: InvoiceEvent[] = [
  {
    idInvoiceEvent: '123e4567-e89b-12d3-a456-426614174000',
    invoiceEventType: 'CREATED',
    eventDate: new Date('2025-01-15T10:30:00'),
    description: 'Facture créée',
    eventTrigger: 'USER',
    triggeredBy: ''
  },
  {
    idInvoiceEvent: '223e4567-e89b-12d3-a456-426614174001',
    invoiceEventType: 'TTN_SUBMISSION_REQUESTED',
    eventDate: new Date('2025-01-15T10:32:00'),
    description: 'Validation fiscale elfatoora.tn lancée',
    eventTrigger: 'SYSTEM',
    triggeredBy: ''
  },
  {
    idInvoiceEvent: '323e4567-e89b-12d3-a456-426614174002',
    invoiceEventType: 'TTN_ACCEPTED',
    eventDate: new Date('2025-01-15T10:34:00'),
    description: 'Validation elfatoora.tn réussie - ID: ELF-1736950000-X7K9P',
    eventTrigger: 'AI AGENT',
    triggeredBy: ''
  },
  {
    idInvoiceEvent: '423e4567-e89b-12d3-a456-426614174003',
    invoiceEventType: 'STATUS_CHANGED',
    eventDate: new Date('2025-01-15T10:35:00'),
    description: 'Facture envoyée au client',
    eventTrigger: 'SYSTEM',
    triggeredBy: ''
  },
  {
    idInvoiceEvent: '523e4567-e89b-12d3-a456-426614174004',
    invoiceEventType: 'PAYMENT_METHOD_UPDATED',
    eventDate: new Date('2025-02-10T09:00:00'),
    description: 'Paiement reçu par virement bancaire',
    eventTrigger: 'USER',
    triggeredBy: ''
  },
  {
    idInvoiceEvent: '623e4567-e89b-12d3-a456-426614174005',
    invoiceEventType: 'SIGNATURE_SUCCEEDED',
    eventDate: new Date('2025-02-10T09:05:00'),
    description: 'Signature électronique validée',
    eventTrigger: 'SYSTEM',
    triggeredBy: ''
  },
]