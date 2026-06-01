import {  InvoiceCreate } from "@/features/billing/models/invoice";
import { PdfDocumentData, PdfLineItem, PdfParty } from "./types";
import { InvoiceCreditNote } from "@/features/billing/models/creditNote";
import { PurchaseOrder } from "@/features/billing/models/purchaseOrder";

type BackendPartner = {
  firstName?: string | null;
  lastName?: string | null;
  companyName?: string | null;
  email?: string | null;
  workPhone?: string | null;
  mobilePhone?: string | null;
  taxId?: string | null;
  billingStreet1?: string | null;
  billingStreet2?: string | null;
  billingCity?: string | null;
  billingState?: string | null;
  billingZip?: string | null;
  billingCountry?: string | null;
};

export function mapPartnerToPdfParty(partner: BackendPartner): PdfParty {
  const fullName = [partner.firstName, partner.lastName].filter(Boolean).join(" ");

  return {
    name: fullName || partner.companyName || "-",
    companyName: partner.companyName,
    taxId: partner.taxId,
    email: partner.email,
    phone: partner.workPhone || partner.mobilePhone,
    address: {
      street1: partner.billingStreet1,
      street2: partner.billingStreet2,
      city: partner.billingCity,
      state: partner.billingState,
      zip: partner.billingZip,
      country: partner.billingCountry,
    },
  };
}

export type InvoiceDto = {
  invoiceNumber: string;
  issueDate: string;
  dueDate?: string | null;
  currency: string;
  invoiceStatus?: string | null;
  partner?: BackendPartner | null;
  items: PdfLineItem[];
  paymentTerms?: string | null;
  paymentMethod?: string | null;
  notes?: string | null;
};

export type CreditNoteDto = {
  creditNoteNumber: string;
  originalInvoiceNumber?: string | null;
  issueDate: string;
  currency: string;
  status?: string | null;
  partner?: BackendPartner | null;
  items: PdfLineItem[];
  notes?: string | null;
};

export type PurchaseOrderDto = {
  purchaseOrderNumber: string;
  issueDate: string;
  deliveryDate?: string | null;
  currency: string;
  purchaseOrderStatus?: string | null;
  supplier?: BackendPartner | null;
  items: PdfLineItem[];
  notes?: string | null;
};

const defaultSeller: PdfParty = {
  name: "KRAKENN SARL",
  companyName: "KRAKENN SARL",
  subtitle: "Services et conseil en informatique",
  taxId: "1234567/A/M/000",
  email: "hello.tunis@kouka.io",
  phone: "+33 00 33 7 67 71 63 54",
  address: {
    street1: "ZONE INDUSTRIELLE KHEIREDDINE",
    street2: "Résidence El-wafa - Lac2, Tunis",
    country: "Tunisie",
  },
};

export function invoiceToPdfData(invoice: InvoiceCreate): PdfDocumentData {
  return {
    type: "INVOICE",
    number: invoice.invoiceNumber,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    currency: invoice.invoiceCurrency,
    status: invoice.invoiceStatus,
    seller: defaultSeller,
    buyer: invoice.partner ? mapPartnerToPdfParty(invoice.partner) : null,
    items: invoice.invoiceItems || [],
    payment: {
      paymentTerms: invoice.paymentCondition,
      paymentMethod: invoice.paymentMethod,
      dueDate: invoice.dueDate,
    },
  };
}

export function creditNoteToPdfData(creditNote: InvoiceCreditNote): PdfDocumentData {
  return {
    type: "CREDIT_NOTE",
    number: creditNote.invoiceCreditNoteNumber,
    issueDate: creditNote.issueDate,
    currency: creditNote.originalInvoice.invoiceCurrency,
    status: creditNote.invoiceCreditNoteStatus,
    seller: defaultSeller,
    buyer: creditNote.originalInvoice.partner ? mapPartnerToPdfParty(creditNote.originalInvoice.partner) : null,
    originalInvoiceNumber: creditNote.originalInvoice.invoiceNumber,
    items: creditNote.creditNoteItems || [],
    payment: {
      paymentTerms: "NET_15",
      paymentMethod: "BANK_TRANSFER",
    },
  };
}

export function purchaseOrderToPdfData(purchaseOrder: PurchaseOrder): PdfDocumentData {
  return {
    type: "PURCHASE_ORDER",
    number: purchaseOrder.purchaseOrderNumber,
    issueDate: purchaseOrder.issueDate,
    deliveryDate: purchaseOrder.issueDate,
    currency: purchaseOrder.currency,
    status: purchaseOrder.purchaseOrderStatus,
    seller: defaultSeller,
    buyer: purchaseOrder.partner ? mapPartnerToPdfParty(purchaseOrder.partner) : null,
    items: purchaseOrder.purchaseOrderItems || [],
    payment: {
      paymentTerms: "NET_30",
      paymentMethod: "BANK_TRANSFER",
    },
  };
}