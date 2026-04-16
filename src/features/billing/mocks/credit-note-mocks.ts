import { Currency } from "lucide-react";
import { creditNoteTypeLabels, CreditNoteTypeSchema } from "../types/creditNoteType";
import { exchangeRateSourceSchema } from "../types/exchangeRateSource";
import { invoiceStatusSchema } from "../types/invoiceStatus";
import { invoiceTypeSchema } from "../types/invoiceType";
import { paymentMethodSchema } from "../types/paymentMethod";
import { currencyTypeSchema } from "../types/currency";
import { invoiceComplianceStatusSchema } from "../types/invoiceComplianceStatus";
import { MOCK_INVOICES } from "./invoice-mocks";
import defaultItem from "./invoice-items-mocks";
import { InvoiceCreditNote } from "../models/creditNote";

export const mockCreditNotes : InvoiceCreditNote[] = [
  {
    invoiceCreditNoteNumber: "FAC-1001",
    issueDate: new Date('2024-03-01'),
    sentToTTNDate: new Date(),
    sentToclientDate: new Date(),
    creationDate: new Date(),
    invoiceCreditNoteStatus: invoiceStatusSchema.enum["NOT_REFUNDED"],  // Valeur à ajuster selon le schéma
    invoiceCreditNoteComplianceStatus: invoiceComplianceStatusSchema.enum.TTN_ACCEPTED,
    totalExclTax: 500,
    totalInclTax: 600, // Total avec taxe
    vatAmount: 100,
    QRCode: "QR12345",
    invoiceItems: [defaultItem()],
    invoiceCreditNoteDocument: null,
    motif: CreditNoteTypeSchema.enum["Quality Issue"],
    originalInvoice: MOCK_INVOICES[1],
    description: "",
    total: 0,
    idInvoiceCreditNote: ""
  },
  {
    invoiceCreditNoteNumber: "FAC-1001",
    issueDate: new Date('2024-03-01'),
    sentToTTNDate: new Date(),
    sentToclientDate: new Date(),
    creationDate: new Date(),
    invoiceCreditNoteStatus: invoiceStatusSchema.enum.DRAFT,  // Valeur à ajuster selon le schéma
    invoiceCreditNoteComplianceStatus: invoiceComplianceStatusSchema.enum.TTN_PENDING,
    totalExclTax: 500,
    totalInclTax: 600, // Total avec taxe
    vatAmount: 100,

    QRCode: "QR12345",
    invoiceItems: [defaultItem()],
    invoiceCreditNoteDocument: null,
    motif: CreditNoteTypeSchema.enum["Quality Issue"],
    originalInvoice: MOCK_INVOICES[1],
    description: "",
    total: 0,
    idInvoiceCreditNote: ""
  },
  {
    invoiceCreditNoteNumber: "FAC-1001",
    issueDate: new Date('2024-03-01'),
    sentToTTNDate: new Date(),
    sentToclientDate: new Date(),
    creationDate: new Date(),
    invoiceCreditNoteStatus: invoiceStatusSchema.enum.REFUNDED, // Valeur à ajuster selon le schéma
    invoiceCreditNoteComplianceStatus: invoiceComplianceStatusSchema.enum.TTN_ACCEPTED,
    totalExclTax: 500,
    totalInclTax: 600, // Total avec taxe
    vatAmount: 100,
    QRCode: "QR12345",
    invoiceItems: [defaultItem()],
    invoiceCreditNoteDocument: null,
    motif: CreditNoteTypeSchema.enum["Quality Issue"],
    originalInvoice: MOCK_INVOICES[1],
    description: "",
    total: 0,
    idInvoiceCreditNote: ""
  }
];

console.log(mockCreditNotes);