import { z } from "zod";

export const clientInvoiceDashboardStatsSchema = z.object({
  id: z.string(),
  client: z.string(),
  amountTND: z.number(),
  amountEUR: z.number(),
  amountUSD: z.number(),
  month: z.number().int().min(1).max(12),
  conformite: z.literal(true), // toujours true
});

export type ClientInvoiceDashboardStats = z.infer<
  typeof clientInvoiceDashboardStatsSchema
>;