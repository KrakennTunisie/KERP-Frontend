import {  InvoiceCreate } from "@/features/billing/models/invoice";
import { PdfDocumentData, PdfLineItem, PdfParty } from "./types";
import { InvoiceCreditNote, InvoiceCreditNoteCreate } from "@/features/billing/models/creditNote";
import { PurchaseOrder } from "@/features/billing/models/purchaseOrder";
import { PartnerSummary } from "@/features/billing/models/partner";
import { CreatePaymentFormValues, PaymentDetails } from "@/features/billing/models/payment";


export function mapPartnerToPdfParty(partner: PartnerSummary): PdfParty {

  return {
    name: partner.partnerName || partner.companyName || "-",
    companyName: partner.companyName,
    taxId: partner.taxRegistrationNumber,
    email: partner.email,
    phone: partner.professionnalPhoneNumber ||"",
    address: {
      street1: partner.billingAddress.street1,
      street2: partner.billingAddress.street2,
      city: partner.billingAddress.city,
      state: partner.billingAddress.state,
      zip: partner.billingAddress.zipCode,
      country: partner.billingAddress.city,
    },
  };
}



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

export function creditNoteToPdfData(creditNote: InvoiceCreditNoteCreate): PdfDocumentData {
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

type PaymentPdfInput = PaymentDetails | CreatePaymentFormValues;


function getPaymentDate(payment: PaymentPdfInput):  Date | undefined {
  if ("paymentDate" in payment && payment.paymentDate) {
    return payment.paymentDate;
  }

  if ("date" in payment && payment.date) {
    return new Date(payment.date);
  }


}

function getPaymentReference(payment: PaymentPdfInput): string {
  if ("reference" in payment && payment.reference) {
    return payment.reference;
  }

  if ("paymentNumber" in payment && payment.paymentNumber) {
    return payment.paymentNumber;
  }

  return "";
}

function getPaymentCurrency(payment: PaymentPdfInput): string {
  if ( payment.invoice?.invoiceCurrency) {
    return payment.invoice.invoiceCurrency;
  }

  if ("currency" in payment && payment.currency) {
    return payment.currency;
  }

  return "TND";
}

function getInvoiceNumber(payment: PaymentPdfInput): string {
  if ( payment.invoice?.invoiceNumber) {
    return payment.invoice.invoiceNumber;
  }

  if ("invoiceNumber" in payment && payment.invoiceNumber) {
    return payment.invoiceNumber;
  }

  return "";
}

export function paymentToPdfData(
  payment: PaymentPdfInput
): PdfDocumentData {
  const paymentDate = getPaymentDate(payment);
  const invoiceNumber = getInvoiceNumber(payment);

  return {
    type: "PAYMENT",
    number: getPaymentReference(payment),
    issueDate: paymentDate ?? "",
    currency: getPaymentCurrency(payment),
    seller: defaultSeller,
    buyer:
       payment.invoice?.partner
        ? mapPartnerToPdfParty(payment.invoice.partner)
        : null,
    originalInvoiceNumber: invoiceNumber,
    items: [],
    payment: {
      paymentMethod: payment.method,
      paymentDate,
      paidAmount: payment.amount,
      invoiceNumber,
    },
  };
}