import { z } from "zod";
import { PaymentConditionSchema } from "../types/paymentCondition";
import { paymentMethodSchema } from "../types/paymentMethod";
import { partnerSchema, partnerSummarySchema } from "./partner";
import { purchaseOrderItemSchema } from "./invoiceItem";
import { purchaseOrderStatusSchema } from "../types/purchaseOrderStatus";
import { currencyTypeSchema } from "../types/currency";
import { exchangeRateSourceSchema } from "../types/exchangeRateSource";
import { fileSchema } from "../types/pdfSchema";
import { documentSchema } from "./document";
import { purchaseOrderTypeSchema } from "../types/PurchaseOrderType";


// champs de base partagés
const purchaseOrderBaseFields = {
    purchaseOrderNumber: z.string(),
    issueDate: z.date(),
    purchaseOrderStatus: purchaseOrderStatusSchema,
    purchaseOrderType: purchaseOrderTypeSchema,
    currency: currencyTypeSchema,
    vatAmount: z.number(),
    paymentMethod: paymentMethodSchema,
    paymentCondition: PaymentConditionSchema,
    exchangeRateReferenceDate: z.date(),
    appliedExchangeRate: z.number(),
    exchangeRateSource: exchangeRateSourceSchema,
};

export const basePurchaseOrderSchema = z.object({
    idPurchaseOrder: z.string(),
    ...purchaseOrderBaseFields,
    totalExclTax: z.number(),
    totalInclTax: z.number(),
    partner: z.lazy(() => partnerSummarySchema).nullable(),
    purchaseOrderDocument: fileSchema.nullable().optional(),
    purchaseOrderItems: z.array(purchaseOrderItemSchema).nullable()
        .refine((items) => {
            if (!items) return true;
            const keys = items.map(item =>
                `${item.description?.trim()}-${item.operationCategory}-${item.vatRate}`);
            return new Set(keys).size === keys.length;
        }, { message: "Les lignes du bon commande doivent être uniques" }),
});

export const purchaseOrderCreateDTO = z.object({
    ...purchaseOrderBaseFields,
    partner: z.string(),
    purchaseOrderItems: z.array(purchaseOrderItemSchema),
    purchaseOrderDocument: fileSchema.nullable(),
});

export const purchaseOrderUpdateDTO = z.object({
    idPurchaseOrder: z.string(),
    ...purchaseOrderBaseFields,
    partner: z.string(),
    purchaseOrderItems: z.array(purchaseOrderItemSchema),
    purchaseOrderDocument: fileSchema.nullable(),
});

export const purchaseOrderSummaryDTO = z.object({
    idPurchaseOrder: z.string(),
    purchaseOrderNumber: z.string(),
    issueDate: z.date(),
    purchaseOrderStatus: purchaseOrderStatusSchema,
    currency: currencyTypeSchema,
})

export const purchaseOrderPageItemSchema = z.object({
    idPurchaseOrder: z.string(),
    purchaseOrderNumber: z.string(),
    issueDate: z.date(),
    purchaseOrderStatus: purchaseOrderStatusSchema,
    purchaseCurrency: currencyTypeSchema,
    vatRate: z.number(),
    appliedExchangeRate: z.number(),
    totalExclTaxEUR: z.number(),
    totalInclTaxEUR: z.number(),
    totalExclTaxTND: z.number(),
    totalInclTaxTND: z.number(),
    totalExclTaxUSD: z.number(),
    totalInclTaxUSD: z.number(),
    partner: partnerSummarySchema,
});

export const purchaseOrderDetailsSchema = z.object({
    idPurchaseOrder: z.string(),
    purchaseOrderNumber: z.string(),
    issueDate: z.date(),
    purchaseOrderStatus: purchaseOrderStatusSchema,
    purchaseOrderType :purchaseOrderTypeSchema,
    purchaseCurrency: currencyTypeSchema,
    vatRate: z.number(),
    totalExclTaxEUR: z.number(),
    totalInclTaxEUR: z.number(),
    totalExclTaxTND: z.number(),
    totalInclTaxTND: z.number(),
    totalExclTaxUSD: z.number(),
    totalInclTaxUSD: z.number(),
    paymentMethod: paymentMethodSchema,
    paymentCondition: PaymentConditionSchema,
    exchangeRateReferenceDate: z.date(),
    appliedExchangeRate: z.number(),
    exchangeRateSource: exchangeRateSourceSchema,
    partner: z.lazy(() => partnerSchema).nullable(),
    purchaseOrderDocument: documentSchema.nullable(),
    purchaseOrderItems: z.array(purchaseOrderItemSchema).nullable(),
});


export const SupplierExpenseStatsSchema = z.object({
  id: z.string(),
  supplier: z.string(),
  category: z.string(),
  amountEUR: z.number(),
  amountTND: z.number(),
  month: z.number().int().min(1).max(12),
});


export const CategoryAmountSchema = z.object({
  category: z.string(),
  montant: z.number(),
});

export type CategoryAmount = z.infer<typeof CategoryAmountSchema>;

export type SupplierExpenseStats = z.infer<typeof SupplierExpenseStatsSchema>;

// types
export type PurchaseOrder = z.infer<typeof basePurchaseOrderSchema>;
export type PurchaseOrderCreate = z.infer<typeof purchaseOrderCreateDTO>;
export type PurchaseOrderUpdate = z.infer<typeof purchaseOrderUpdateDTO>;
export type PurchaseOrderPageItem = z.infer<typeof purchaseOrderPageItemSchema>;
export type PurchaseOrderDetails = z.infer<typeof purchaseOrderDetailsSchema>;
export type PurchaseOrderSummary = z.infer<typeof purchaseOrderSummaryDTO>;