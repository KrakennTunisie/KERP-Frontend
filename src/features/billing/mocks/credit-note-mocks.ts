import { Currency } from "lucide-react";
import { CreditNote } from "../models/creditNote";
import { creditNoteTypeLabels, CreditNoteTypeSchema } from "../types/creditNoteType";
import { exchangeRateSourceSchema } from "../types/exchangeRateSource";
import { invoiceStatusSchema } from "../types/invoiceStatus";
import { invoiceTypeSchema } from "../types/invoiceType";
import { paymentMethodSchema } from "../types/paymentMethod";
import { currencyTypeSchema } from "../types/currency";
import { invoiceComplianceStatusSchema } from "../types/invoiceComplianceStatus";
import { MOCK_INVOICES } from "./invoice-mocks";
import defaultItem from "./invoice-items-mocks";

export const mockCreditNotes : CreditNote[] = [
  {
   
    invoiceNumber: "FAC-1001",
    issueDate: new Date('2024-03-01'),
    sentToTTNDate:  new Date(),
    sentToclientDate:  new Date(),
    creationDate: new Date(),
    invoiceStatus: invoiceStatusSchema.enum["NON REMBOURSÉE"],  // Valeur à ajuster selon le schéma
    invoiceComplianceStatus: invoiceComplianceStatusSchema.enum.TTN_ACCEPTED,
    totalExclTax: 500,
    totalInclTax: 600,  // Total avec taxe
    vatAmount: 100,
    QRCode: "QR12345",
    invoiceItems: [defaultItem()],
    invoiceDocument: null,
    creditNoteReason: CreditNoteTypeSchema.enum["Quality Issue"],
    originalInvoice:MOCK_INVOICES[1] ,
  },
  {
     invoiceNumber: "FAC-1001",
    issueDate: new Date('2024-03-01'),
    sentToTTNDate:  new Date(),
    sentToclientDate:  new Date(),
    creationDate: new Date(),
    invoiceStatus: invoiceStatusSchema.enum.BROULLION,  // Valeur à ajuster selon le schéma
    invoiceComplianceStatus: invoiceComplianceStatusSchema.enum.TTN_PENDING,
    totalExclTax: 500,
    totalInclTax: 600,  // Total avec taxe
    vatAmount: 100,

    QRCode: "QR12345",
    invoiceItems: [defaultItem()],
    invoiceDocument: null,
    creditNoteReason: CreditNoteTypeSchema.enum["Quality Issue"],
    originalInvoice:MOCK_INVOICES[1] ,
  },
  {
     invoiceNumber: "FAC-1001",
    issueDate: new Date('2024-03-01'),
    sentToTTNDate:  new Date(),
    sentToclientDate:  new Date(),
    creationDate: new Date(),
    invoiceStatus: invoiceStatusSchema.enum.REMBOURSÉE,  // Valeur à ajuster selon le schéma
    invoiceComplianceStatus: invoiceComplianceStatusSchema.enum.TTN_ACCEPTED,
    totalExclTax: 500,
    totalInclTax: 600,  // Total avec taxe
    vatAmount: 100,
    QRCode: "QR12345",
    invoiceItems: [defaultItem()],
    invoiceDocument: null,
    creditNoteReason: CreditNoteTypeSchema.enum["Quality Issue"],
    originalInvoice:MOCK_INVOICES[1] ,
  }
];

console.log(mockCreditNotes);