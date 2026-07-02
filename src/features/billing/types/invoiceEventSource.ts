import { z } from 'zod'

export const InvoiceEventSourceSchema = z.enum([
  'USER',
  'SYSTEM',
  'AI AGENT',
])

export type InvoiceEventSource = z.infer<typeof InvoiceEventSourceSchema>

export const InvoiceEventSourceLabels: Record<InvoiceEventSource, string> = {
  USER: "Utilisateur",
  SYSTEM: "Système",
  "AI AGENT": "Agent IA",
};