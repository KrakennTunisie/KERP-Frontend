import { z } from "zod";
import { partnerSchema } from "./partner";
import { documentSchema } from "./document";
import { invoiceTypeSchema } from "../types/invoiceType";
import { invoiceStatusSchema } from "../types/invoiceStatus";
import { invoiceComplianceStatusSchema } from "../types/invoiceComplianceStatus";
import { paymentMethodSchema } from "../types/paymentMethod";
import { exchangeRateSourceSchema } from "../types/exchangeRateSource";
import { purchaseOrderSchema } from "./purchaseOrder";
import { invoiceItemSchema } from "./invoiceItem";
import { tvaRateSchema } from "../types/tvaRate";
import { Currency } from "lucide-react";


export const invoiceSchema = z.object({
    idInvoice : z.uuid(),
    invoiceNumber: z.string(),
    issueDate:  z.date(),
    dueDate:  z.date(),
    invoiceType: invoiceTypeSchema,
    invoiceStatus: invoiceStatusSchema,
    invoiceComplianceStatus: invoiceComplianceStatusSchema,
    currency:z.string(),
    totalExclTaxEUR: z.number(),
    totalInclTaxEUR: z.number(),
    totalExclTaxTND : z.number(),
    totalInclTaxTND: z.number(),
    vatRate : tvaRateSchema,
    paymentMethod: paymentMethodSchema,
    exchangeRateReferenceDate: z.date(),
    appliedExchangeRate: z.number(),
    exchangeRateSource : exchangeRateSourceSchema,
    complianceQRcode : z.string(),
    PaymentCondition: z.string(),
    purchaseOrder: purchaseOrderSchema.nullable(), // Null pour le momemnt , pour faciliter le test
    partner : z.lazy(()=>partnerSchema).nullable(),
    invoiceItems : z.array(invoiceItemSchema).nullable(),
    invoiceDocument : documentSchema.nullable(),    

})

export type Invoice = z.infer<typeof invoiceSchema>;