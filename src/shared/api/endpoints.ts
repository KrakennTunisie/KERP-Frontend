import { buildQueryString } from "./query-string-builder";
import { GetPartnersParams } from "./types";

export const BILLING_ENDPOINTS = {
  clients: "/partners/clients",
  suppliers: "/partners/suppliers",
  getClients: (query? : GetPartnersParams)=> `/partners/clients${buildQueryString(query)}`,
  getClientsSummary: (query? : GetPartnersParams)=> `/partners/clients-summary${buildQueryString(query)}`,
  getSuppliers: (query? : GetPartnersParams)=> `/partners/suppliers${buildQueryString(query)}`,
  clientById: (id: string) => `/partners/clients/${id}`,
  supplierById: (id: string) => `/partners/suppliers/${id}`,

  clientInvoices: "/invoices/clients",
  supplierInvoices: "/invoices/suppliers",
  clientInvoiceById: (id: string) => `/invoices/clients/${id}`,
  supplierInvoiceById: (id: string) => `/invoices/suppliers/${id}`,

  uploadDocument: "/documents/upload",
};

export const INVOICES_ENDPOINTS={
  clientsInvoices: "/invoices/client-invoices",
  suppliersInvoices: "/invoices/supplier-invoices",
  nextNumber: "/invoices/next-number",
  getClientsInvoices: (query? : GetPartnersParams)=> `/invoices/client-invoices${buildQueryString(query)}`,
  getSuppliersInvoices: (query? : GetPartnersParams)=> `/invoices/supplier-invoices${buildQueryString(query)}`,
  clientInvoiceById: (id?: string) => `/invoices/client-invoices/${id}`,
  supplierInvoiceById: (id: string) => `/invoices/supplier-invoices/${id}`,

  clientInvoicesById: (id: string) => `/invoices/clients/${id}`,
  supplierInvoicesById: (id: string) => `/invoices/suppliers/${id}`,
}

export const INVOICES_CREDIT_NOTE_ENDPOINTS={
  invoiceCreditNotes: "/credit-note-invoices",
  nextNumber: "/credit-note-invoices/next-number",

  //getInvoiceCreditNotes: (query? : GetPartnersParams)=> `/credit-note-invoices/invoice/${buildQueryString(query)}`,
  getInvoiceCreditNotes: (id : string)=> `/credit-note-invoices/invoice/${id}`,
  invoiceCreditNoteById: (id?: string) => `/credit-note-invoices/${id}`,
  updateStatusInvoiceCreditNote: (id: string)=> `/credit-note-invoices/${id}/status`,
}

export const PURCHASE_ORDER_ENDPOINTS = {
  purchaseOrders: "/purchase-orders",
  nextNumber: "/purchase-orders/next-number",
  getPurchaseOrders: (query? : GetPartnersParams)=> `/purchase-orders${buildQueryString(query)}`,
  purchaseOrderById: (id: string) => `/purchase-orders/${id}`, 
}