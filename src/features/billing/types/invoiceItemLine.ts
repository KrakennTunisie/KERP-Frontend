import { z } from "zod";
import { tvaRateSchema } from "./tvaRate";

export const invoiceItemLineSchema = z.object({
    id:          z.string(),
    designation: z.string().min(1, "La désignation est requise"),
    qte:         z.number().min(1, "La quantité doit être supérieure à 0"),
    puHt:        z.number().min(0, "Le prix unitaire doit être positif"),
    tva:         tvaRateSchema,
});

export type invoiceLine = z.infer<typeof invoiceItemLineSchema>;