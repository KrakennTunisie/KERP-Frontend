// src/shared/api/endpoints.ts
export const BILLING_ENDPOINTS = {
  partners: "/partners",
  clients: "/partners/clients",
  suppliers: "/partners/suppliers",
  clientById: (id: string) => `/partners/clients/${id}`,
  supplierById: (id: string) => `/partners/suppliers/${id}`,

  clientInvoices: "/invoices/clients",
  supplierInvoices: "/invoices/suppliers",
  clientInvoiceById: (id: string) => `/invoices/clients/${id}`,
  supplierInvoiceById: (id: string) => `/invoices/suppliers/${id}`,

  uploadDocument: "/documents/upload",
};