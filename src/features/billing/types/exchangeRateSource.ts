import { z } from "zod";


export const exchangeRateSourceSchema = z.enum(["CENTRAL_BANK", "EUROPEAN_CENTRAL_BANK", "COMMERCIAL_BANK", "EXTERNAL_API", "MANUAL"]);
export type ExchangeRateSource = z.infer<typeof exchangeRateSourceSchema>;