import { z } from "zod";
import { invoiceSchema } from "./invoice";
import { PaymentConditionSchema } from "../types/paymentCondition";
import { paymentMethodSchema } from "../types/paymentMethod";
import { partnerSchema } from "./partner";
import { invoiceItemSchema } from "./invoiceItem";
import { purchaseOrderStatusSchema } from "../types/purchaseOrderStatus";
import { currencyTypeSchema } from "../types/currency";
import { exchangeRateSourceSchema } from "../types/exchangeRateSource";


export const purchaseOrderSchema = z.object({
        idPurchaseOrder : z.string(),
        purchaseOrderNumber: z.string(),
        issueDate:  z.date(),
        creationDate: z.date().nullable(),
        Status:purchaseOrderStatusSchema,
        currency: currencyTypeSchema,
        totalExclTax: z.number(),
        totalInclTax: z.number(),
        vatAmount: z.number(),
        paymentMethod: paymentMethodSchema,
        exchangeRateReferenceDate: z.date(),
        appliedExchangeRate: z.number(),
        exchangeRateSource : exchangeRateSourceSchema,
        PaymentCondition: PaymentConditionSchema,
        partner : z.lazy(()=>partnerSchema).nullable(),
        purchaseOrderItems : z.array(invoiceItemSchema).nullable()
       .refine((items) => {
        if (!items) return true;
        const keys = items.map((item) =>
            `${item.description?.trim()}-${item.operationCategory}-${item.vatRate}`);
        return new Set(keys).size === keys.length;}, {
        message: "Les lignes de facture doivent être uniques",
        }), 
});

export type PurchaseOrder = z.infer<typeof purchaseOrderSchema>;