import { z } from 'zod'

export const InvoiceEventTypeSchema = z.enum([
  'CREATED',
  'UPDATED',
  'STATUS_CHANGED',
  'PAYMENT_REGISTERED',
  'PAYMENT_METHOD_UPDATED',
  'CANCELLED',
  'DOCUMENT_ATTACHED',
  'DOCUMENT_VALIDATED',
  'SIGNATURE_REQUESTED',
  'SIGNATURE_SUCCEEDED',
  'SIGNATURE_FAILED',
  'TTN_SUBMISSION_REQUESTED',
  'TTN_SUBMITTED',
  'TTN_ACCEPTED',
  'TTN_REJECTED',
  'FX_RATE_APPLIED',
])

export type InvoiceEventType = z.infer<typeof InvoiceEventTypeSchema>

export const InvoiceEventLabels: Record<InvoiceEventType, string> = {
    CREATED: "Facture a été créée",
    UPDATED: "Mis à jour",
    STATUS_CHANGED:"Status changée",
    PAYMENT_REGISTERED:"Paiement enregistrée",
    PAYMENT_METHOD_UPDATED:"Méthode de paiement mis à jour",
    CANCELLED:"Annulée",
    DOCUMENT_ATTACHED:"Document Attachée",
    DOCUMENT_VALIDATED:"Document validée",
    SIGNATURE_REQUESTED:"Demande une signature",
    SIGNATURE_SUCCEEDED:"Succées de la signature",
    SIGNATURE_FAILED:"Echéc de la signature",
    TTN_SUBMISSION_REQUESTED:"Soumission au TTN demandée",
    TTN_SUBMITTED:"TTN a soumis la facture",
    TTN_ACCEPTED:"TTN a acceptée la facture",
    TTN_REJECTED:"TTN a rejetée la facture",
    FX_RATE_APPLIED:"Taux d'échange a été appliquée"

};