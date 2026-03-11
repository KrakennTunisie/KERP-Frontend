import { buildQueryString } from "./query-string-builder";
import { GetPartnersParams } from "./types";

export const BILLING_ENDPOINTS = {
  clients: "/partners/clients",
  suppliers: "/partners/suppliers",
  getClients: (query? : GetPartnersParams)=> `/partners/clients?${buildQueryString(query)}`,
  getSuppliers: (query? : GetPartnersParams)=> `/partners/suppliers?${buildQueryString(query)}`,
  clientById: (id: string) => `/partners/clients/${id}`,
  supplierById: (id: string) => `/partners/suppliers/${id}`,

  clientInvoices: "/invoices/clients",
  supplierInvoices: "/invoices/suppliers",
  clientInvoiceById: (id: string) => `/invoices/clients/${id}`,
  supplierInvoiceById: (id: string) => `/invoices/suppliers/${id}`,

  uploadDocument: "/documents/upload",
};