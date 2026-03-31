import { z } from "zod";
import { invoiceSchema } from "../models/invoice";
import { PaymentConditionSchema } from "../types/paymentCondition";

type Invoice = z.infer<typeof invoiceSchema>;

export const MOCK_INVOICES: Invoice[] = [
  {
    idInvoice: "550e84005",
    invoiceNumber: "FC-2025-001",
    issueDate: new Date("2025-01-15"),
    dueDate: new Date("2025-02-14"),
    invoiceType: "SALE",
    invoiceStatus: "PAYÉE",
    invoiceComplianceStatus: "RECEIVED",
   
    
    totalExclTax: 33500,
    totalInclTax: 39865,
    PaymentCondition:PaymentConditionSchema.enum.NET_15,
    vatRate: 19,
    paymentMethod: "BANK_TRANSFER",
     vatAmount:20,
    exchangeRateReferenceDate: new Date("2025-01-15"),
    appliedExchangeRate: 3.35,
    exchangeRateSource: "CENTRAL_BANK",
    complianceQRcode: "QR-FC2025001-ABCD1234",
    currency: "TND",
    purchaseOrder: null,
    partner: null,
    invoiceItems: null,
    invoiceDocument: null
  },
  {
      idInvoice: "550e84001",
      invoiceNumber: "FC-2025-002",
      issueDate: new Date("2025-02-01"),
      dueDate: new Date("2025-03-01"),
      invoiceType: "SALE",
      invoiceStatus: "À PAYER",
      invoiceComplianceStatus: "RECEIVED",
     
      totalExclTax: 17420,
      totalInclTax: 20729.80,
      vatRate: 19,
      PaymentCondition:PaymentConditionSchema.enum.NET_15,
      paymentMethod: "BANK_TRANSFER",
       vatAmount:20,
      exchangeRateReferenceDate: new Date("2025-02-01"),
      appliedExchangeRate: 3.35,
      exchangeRateSource: "CENTRAL_BANK",
      complianceQRcode: "QR-FC2025002-EFGH5678",
      currency: "EUR",
      purchaseOrder:null,
      partner: null,
      invoiceItems: null,
      invoiceDocument: null
  },
  {
    idInvoice: "550e84002",
    invoiceNumber: "FC-2026-001",
    issueDate: new Date("2026-01-10"),
    dueDate: new Date("2026-02-10"),
    invoiceType: "SALE",
    invoiceStatus: "BROULLION",
    invoiceComplianceStatus: "RECEIVED",
    vatAmount:20,
    totalExclTax: 29312.50,
    totalInclTax: 34881.87,
    vatRate: 19,
    PaymentCondition:PaymentConditionSchema.enum.NET_15,
    paymentMethod: "BANK_TRANSFER",
    exchangeRateReferenceDate: new Date("2026-01-10"),
    appliedExchangeRate: 3.35,
    exchangeRateSource: "CENTRAL_BANK",
    currency: "TND",
    complianceQRcode: "",
    purchaseOrder: null,
    partner: null,
    invoiceItems: null,
    invoiceDocument: null,
  },
];