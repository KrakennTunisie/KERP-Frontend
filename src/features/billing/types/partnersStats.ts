import { z } from "zod";

export const partnerInvoiceStatsSchema = z.object({
  totalAmountTND: z.number(),
  totalAmountEUR: z.number(),
  totalAmountUSD: z.number(),

  totalInvoices: z.number().int(),
  paidInvoices: z.number().int(),
  pendingInvoices: z.number().int(),

  pendingAmountTND: z.number(),
  pendingAmountEUR: z.number(),
  pendingAmountUSD: z.number(),

  averageInvoiceTND: z.number(),
  averageInvoiceEUR: z.number(),
  averageInvoiceUSD: z.number(),
});

export type PartnerInvoiceStats = z.infer<typeof partnerInvoiceStatsSchema>;