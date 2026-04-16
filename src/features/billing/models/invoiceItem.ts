import { z } from "zod";
import { operationCategorySchema } from "../types/operationCategory";


export const 


invoiceItemSchema = z.object({
    idInvoiceItem : z.uuid(),
    description : z.string(),
    quantity: z.number(),
    unityPriceEXclTax: z.number(),
    vatRate: z.number(),
    itemTotalExclTax: z.number(),
    itemTaxAmount : z.number(),
    itemTotalInclTax : z.number(),
    operationCategory : operationCategorySchema,
    invoice:z.string().nullable(),
}).strict();
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;