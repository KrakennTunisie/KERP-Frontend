import { BaseItem, InvoiceItem } from "@/features/billing/models/invoiceItem";
import { DiscountType } from "@/features/billing/types/discountType";
import { OperationCategory } from "@/features/billing/types/operationCategory";

export type PdfDocumentType = "INVOICE" | "CREDIT_NOTE" | "PURCHASE_ORDER" | "PAYMENT";

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
    description:string|null,
    quantity: number ,
    unityPriceEXclTax: number ,
    vatRate: number ,
    itemTotalExclTax: number ,
    itemTaxAmount: number ,
    itemTotalInclTax: number ,
    operationCategory: OperationCategory,
    discountType?:DiscountType | null,
    discountValue?:number,
    discountTotal?:number ,
    netHT?:number ,
};

export type PdfPaymentInfo = {
  paymentTerms?: string | null;
  paymentMethod?: string | null;
  paymentDate?: Date;
  paidAmount?: number;
  invoiceNumber?: string;
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

  items: PdfLineItem[];

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