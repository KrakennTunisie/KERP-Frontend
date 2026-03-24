import { z } from "zod";


export const currencyTypeSchema = z.enum(["EUR", "TND"]);
export type CurrencyType = z.infer<typeof currencyTypeSchema>;