import { z } from "zod";
import { currencyTypeSchema } from "../types/currency";
import { exchangeRateSourceSchema } from "../types/exchangeRateSource";
import { PaymentConditionSchema } from "../types/paymentCondition";
import { paymentMethodSchema } from "../types/paymentMethod";
import { fileSchema } from "../types/pdfSchema";
import { purchaseOrderStatusSchema } from "../types/purchaseOrderStatus";
import { invoiceItemSchema } from "./invoiceItem";
import { partnerSchema } from "./partner";


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
        purchaseOrderDocument : fileSchema.nullable(),     
        purchaseOrderItems : z.array(invoiceItemSchema).nullable()
       .refine((items) => {
        if (!items) return true;
        const keys = items.map((item) =>
            `${item.description?.trim()}-${item.operationCategory}-${item.vatRate}`);
        return new Set(keys).size === keys.length;}, {
        message: "Les lignes de facture doivent être uniques",
        }), 
});

export const purchaseOrderDTO = z.object({
        purchaseOrderNumber: z.string(),
        issueDate:  z.date(),
        creationDate: z.date().nullable(),
        currency: currencyTypeSchema,
        paymentMethod: paymentMethodSchema,
        exchangeRateReferenceDate: z.date(),
        appliedExchangeRate: z.number(),
        exchangeRateSource : exchangeRateSourceSchema,
        PaymentCondition: PaymentConditionSchema,
        partner : z.string(),
        purchaseOrderItems : z.array(invoiceItemSchema),
        purchaseOrderDocument : fileSchema.nullable(),     
});

export type purchaseOrderDTO = z.infer<typeof purchaseOrderDTO>;

export type PurchaseOrder = z.infer<typeof purchaseOrderSchema>;