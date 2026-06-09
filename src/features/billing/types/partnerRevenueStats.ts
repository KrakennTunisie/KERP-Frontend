import { z } from "zod";

export const partnerRevunueStats = z.object({
  period: z.string(),
  monthLabel: z.string(),
  revenueHT: z.number(),
  revenueTVA: z.number(),
  revenueTTC: z.number(),
  nombreFactures: z.number(),
});

export type PartnerRevenueStats = z.infer<
  typeof partnerRevunueStats
>;