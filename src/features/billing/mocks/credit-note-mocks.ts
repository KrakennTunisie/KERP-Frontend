import { Currency } from "lucide-react";
import { CreditNote } from "../models/creditNote";
import { creditNoteTypeLabels, CreditNoteTypeSchema } from "../types/creditNoteType";
import { exchangeRateSourceSchema } from "../types/exchangeRateSource";
import { invoiceStatusSchema } from "../types/invoiceStatus";
import { invoiceTypeSchema } from "../types/invoiceType";
import { paymentMethodSchema } from "../types/paymentMethod";
import { currencyTypeSchema } from "../types/currency";

export const mockCreditNotes : CreditNote[] = [
  {
    idInvoice: "123e4567",
    invoiceNumber: "FAC-1001",
    issueDate: new Date('2024-03-01'),
    dueDate: new Date('2024-03-16'),
    invoiceType: invoiceTypeSchema.enum.CREDITNOTE,  // Valeur à ajuster selon le schéma
    invoiceStatus: invoiceStatusSchema.enum["NON REMBOURSÉE"],  // Valeur à ajuster selon le schéma
    invoiceComplianceStatus: null,
    currency: "EUR",  // Valeur à ajuster selon le schéma
    totalExclTax: 500,
    totalInclTax: 600,  // Total avec taxe
    vatAmount: 100,
    vatRate: 19,  // Exemple de taux de TVA
    paymentMethod: paymentMethodSchema.enum.CASH,
    exchangeRateReferenceDate: new Date('2024-03-01'),
    appliedExchangeRate: 1.1,  // Exemple de taux de change
    exchangeRateSource: exchangeRateSourceSchema.enum.EXTERNAL_API,
    complianceQRcode: "QR12345",
    PaymentCondition: "NET_30",
    purchaseOrder: null,
    partner: null,
    invoiceItems: [],
    invoiceDocument: null,
    creditNoteReason: CreditNoteTypeSchema.enum["Quality Issue"],
    refOriginalInvoice: "123e4567",
  },
  {
    idInvoice: "123e4567",
    invoiceNumber: "FAC-1002",
    issueDate: new Date('2024-03-05'),
    dueDate: new Date('2024-03-20'),
    invoiceType: invoiceTypeSchema.enum.CREDITNOTE,
    invoiceStatus: invoiceStatusSchema.enum.REMBOURSÉE,
    invoiceComplianceStatus: null,
    currency: "EUR",
    totalExclTax: 700,
    totalInclTax: 840,
    vatAmount: 140,
    vatRate: 13,
    paymentMethod: paymentMethodSchema.enum.BANK_TRANSFER,
    exchangeRateReferenceDate: new Date('2024-03-05'),
    appliedExchangeRate: 1.2,
    exchangeRateSource: exchangeRateSourceSchema.enum.EXTERNAL_API,
    complianceQRcode: "QR67890",
    PaymentCondition: "NET_30",
    purchaseOrder: null,
    partner: null,
    invoiceItems: [],
    invoiceDocument: null,
    creditNoteReason: CreditNoteTypeSchema.enum["Price Adjustment"],
    refOriginalInvoice: "123e4567",
  },
  {
    idInvoice: "123e4567",
    invoiceNumber: "FAC-1003",
    issueDate: new Date('2024-03-10'),
    dueDate: new Date('2024-03-25'),
    invoiceType: invoiceTypeSchema.enum.CREDITNOTE,
    invoiceStatus: invoiceStatusSchema.enum.BROULLION,
    invoiceComplianceStatus: null,
    currency: currencyTypeSchema.enum.EUR,
    totalExclTax: 300,
    totalInclTax: 360,
    vatAmount: 60,
    vatRate: 7,
    paymentMethod: paymentMethodSchema.enum.CHECK,
    exchangeRateReferenceDate: new Date('2024-03-10'),
    appliedExchangeRate: 1.3,
    exchangeRateSource: exchangeRateSourceSchema.enum.EXTERNAL_API,
    complianceQRcode: "QR54321",
    PaymentCondition: "IMMEDIATE",
    purchaseOrder: null,
    partner: null,
    invoiceItems: [],
    invoiceDocument: null,
    creditNoteReason: CreditNoteTypeSchema.enum["Billing Error"],
    refOriginalInvoice: "123e4567",
  }
];

console.log(mockCreditNotes);