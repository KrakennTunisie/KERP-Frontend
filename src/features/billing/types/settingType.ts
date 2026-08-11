import { z } from "zod";

export const SettingTypeSchema = z.enum([
  "PAYMENT_CONDITION",
  "OPERATION_CATEGORY",
  "TVA_RATE",
]);

export type SettingType = z.infer<typeof SettingTypeSchema>;