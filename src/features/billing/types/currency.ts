import { z } from "zod";


export const currencyTypeSchema = z.enum(["EUR", "TND" ,"DOLLAR"]);
export type CurrencyType = z.infer<typeof currencyTypeSchema>;