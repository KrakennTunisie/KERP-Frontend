import { z } from "zod";
import { invoiceSchema } from "./invoice";


export const purchaseOrderSchema = z.object({

    idPurchaseOrder : z.uuid(),
    reference : z.string(),
    orderDate : z.date(),
    totalAmountExclTax : z.number(),
    totalAmountInclTax : z.number(),
    invoices: z.array(z.lazy((): any => invoiceSchema)).optional(),
});


export type purchaseOrder = z.infer<typeof purchaseOrderSchema>;