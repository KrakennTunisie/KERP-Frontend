import { z } from "zod";

export const discountTypeSchema = z.enum([
  "PERCENTAGE",
  "AMOUNT",
]);

export const discountTypeOptions = [
  {
    value: discountTypeSchema.enum.PERCENTAGE,
    label: "%",
  },
  {
    value: discountTypeSchema.enum.AMOUNT,
    label: "Montant",
  },
] as const;

export type DiscountType = z.infer<typeof discountTypeSchema>;