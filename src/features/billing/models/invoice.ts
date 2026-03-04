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


export const invoiceSchema = z.object({
    idInvoice : z.uuid(),
    invoiceNumber: z.string(),
    issueDate: z.date(),
    dueDate: z.date(),
    invoiceType: invoiceTypeSchema,
    invoiceStatus: invoiceStatusSchema,
    invoiceComplianceStatus: invoiceComplianceStatusSchema,
    totalExclTaxEUR: z.number(),
    totalInclTaxEUR: z.number(),
    totalExclTaxTND : z.number(),
    totalInclTaxTND: z.number(),
    vatRate : z.number(),
    paymentMethod: paymentMethodSchema,
    creditedAccount: z.string(),
    exchangeRateReferenceDate: z.date(),
    appliedExchangeRate: z.number(),
    exchangeRateSource : exchangeRateSourceSchema,
    complianceQRcode : z.string(),
    purchaseOrder: purchaseOrderSchema,
    partner : partnerSchema,
    invoiceItems : z.array(invoiceItemSchema),
    invoiceDocument : documentSchema,    

})

export type Invoice = z.infer<typeof invoiceSchema>;