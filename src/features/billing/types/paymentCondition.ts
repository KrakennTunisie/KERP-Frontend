import { z } from "zod";

// schema
export const PaymentConditionSchema = z.enum([
  "NET_15",
  "NET_30",
  "NET_45",
  "IMMEDIATE",
]);

export type PaymentCondition = z.infer<typeof PaymentConditionSchema>;

export const PaymentConditionLabels: Record<PaymentCondition, string> = {
  NET_15: "Net 15 jours",
  NET_30: "Net 30 jours",
  NET_45: "Net 45 jours",
  IMMEDIATE: "Immédiat",
};