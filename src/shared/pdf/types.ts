import { BaseItem } from "@/features/billing/models/invoiceItem";

export type PdfDocumentType = "INVOICE" | "CREDIT_NOTE" | "PURCHASE_ORDER";

export type PdfParty = {
  name: string;
  companyName?: string | null;
  subtitle?: string | null;
  taxId?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: {
    street1?: string | null;
    street2?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
    country?: string | null;
  };
};

export type PdfLineItem = {
  description: string;
  reference?: string | null;
  category?: string | null;
  quantity: number;
  unitPrice: number;
  taxRate?: number | null;
  discountRate?: number | null;
};

export type PdfPaymentInfo = {
  paymentTerms?: string | null;
  paymentMethod?: string | null;
  iban?: string | null;
  bankName?: string | null;
  dueDate?: Date | string | null;
};

export type PdfDocumentData = {
  type: PdfDocumentType;
  number: string;
  issueDate: Date | string;
  dueDate?: Date | string | null;
  currency: string;
  status?: string | null;

  seller: PdfParty;
  buyer?: PdfParty | null;

  originalInvoiceNumber?: string | null;
  purchaseOrderNumber?: string | null;
  deliveryDate?: Date | string | null;

  items: BaseItem[];

  notes?: string | null;
  terms?: string | null;
  payment?: PdfPaymentInfo | null;

  companyLogoUrl?: string | null;
  accentColor?: string;
  generatedAt?: Date | string | null;
};

export type PdfTotals = {
  subtotalHT: number;
  discountTotal: number;
  taxTotal: number;
  totalTTC: number;
};