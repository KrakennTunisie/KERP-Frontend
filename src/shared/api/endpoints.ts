import { buildQueryString } from "./query-string-builder";
import {  ExchangeRateParams, GetListParams } from "./types";

export const BILLING_ENDPOINTS = {
  clients: "/partners/clients",
  suppliers: "/partners/suppliers",
  getClients: (query? : GetListParams)=> `/partners/clients${buildQueryString(query)}`,
  getClientsSummary: (query? : GetListParams)=> `/partners/clients-summary${buildQueryString(query)}`,
  getSuppliers: (query? : GetListParams)=> `/partners/suppliers${buildQueryString(query)}`,
  clientById: (id: string) => `/partners/clients/${id}`,
  supplierById: (id: string) => `/partners/suppliers/${id}`,

  clientInvoices: "/invoices/clients",
  supplierInvoices: "/invoices/suppliers",
  clientInvoiceById: (id: string) => `/invoices/clients/${id}`,
  supplierInvoiceById: (id: string) => `/invoices/suppliers/${id}`,

  purchaseOrder: "/purchase-orders",
  getPurchaseOrders:(query? : GetListParams)=> `/purchase-orders/${buildQueryString(query)}`,
  purchaseOrderById: (id : string) => `/purchase-orders/${id}`,

  uploadDocument: "/documents/upload",
};

export const INVOICES_ENDPOINTS={
  clientsInvoices: "/invoices/client-invoices",
  suppliersInvoices: "/invoices/supplier-invoices",
  nextNumber: "/invoices/next-number",
  getClientsInvoices: (query? : GetListParams)=> `/invoices/client-invoices${buildQueryString(query)}`,
  getSuppliersInvoices: (query? : GetListParams)=> `/invoices/supplier-invoices${buildQueryString(query)}`,
  clientInvoiceById: (id?: string) => `/invoices/client-invoices/${id}`,
  clientInvoiceStatusById: (id?: string) => `/invoices/client-invoices/${id}/status`,
  clientInvoiceStats: (id?: string) => `/invoices/client-invoices/stats/${id}`,
  supplierInvoiceStats: (id?: string) => `/invoices/supplier-invoices/stats/${id}`,

  supplierInvoiceById: (id: string) => `/invoices/supplier-invoices/${id}`,

  clientInvoicesById: (id: string) => `/invoices/clients/${id}`,
  supplierInvoicesById: (id: string) => `/invoices/suppliers/${id}`,
}

export const INVOICES_CREDIT_NOTE_ENDPOINTS={
  invoiceCreditNotes: "/credit-note-invoices/",
  nextNumber: "/credit-note-invoices/next-number",

  //getInvoiceCreditNotes: (query? : GetPartnersParams)=> `/credit-note-invoices/invoice/${buildQueryString(query)}`,
  getInvoiceCreditNotes: (id : string, query?:GetListParams)=> `/credit-note-invoices/invoice/${id}${buildQueryString(query)}`,
  invoiceCreditNoteById: (id?: string) => `/credit-note-invoices/${id}`,
  updateStatusInvoiceCreditNote: (id: string)=> `/credit-note-invoices/${id}/status`,
}

export const PURCHASE_ORDER_ENDPOINTS = {
  purchaseOrders: "/purchase-orders/",
  nextNumber: "/purchase-orders/next-number",
  getPurchaseOrders: (query? : GetListParams)=> `/purchase-orders/${buildQueryString(query)}`,
  purchaseOrderById: (id?: string) => `/purchase-orders/${id}`, 
}

export const EXCHANGE_RATE_ENDPOINTS = {
  exchangeRate: "/exchange-rate/content",
  getExchangeRate: (query? : ExchangeRateParams)=> `/exchange-rate/content${buildQueryString(query)}`,

}