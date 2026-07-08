import { PartnerDocumentType } from "@/features/billing/types/documentType";
import { buildQueryString } from "./query-string-builder";
import {  ExchangeRateParams, GetListParams } from "./types";

export const BILLING_ENDPOINTS = {
  clients: "/partners/clients",
  suppliers: "/partners/suppliers",
  getClients: (query? : GetListParams)=> `/partners/clients${buildQueryString(query)}`,
  getClientsSummary: (query? : GetListParams)=> `/partners/clients-summary${buildQueryString(query)}`,
  getSuppliersSummary: (query? : GetListParams)=> `/partners/suppliers-summary${buildQueryString(query)}`,
  getSuppliers: (query? : GetListParams)=> `/partners/suppliers${buildQueryString(query)}`,
  clientById: (id: string) => `/partners/clients/${id}`,
  supplierById: (id: string) => `/partners/suppliers/${id}`,

  clientInvoices: "/invoices/clients",
  supplierInvoices: "/invoices/suppliers",
  clientInvoiceById: (id: string) => `/invoices/clients/${id}`,
  supplierInvoiceById: (id: string) => `/invoices/suppliers/${id}`,
  getClientsInvoices: (idClient:string) => `/invoices/last/client-invoices/${idClient}`,
  getSuppliersInvoices: (idSupplier:string) => `/invoices/last/supplier-invoices/${idSupplier}`,


  updatestatus: (id: string, statusClient: boolean) => `/partners/clients/updateStatus/${id}?statusClient=${statusClient}`,
  updateSupplierstatus: (id: string, statusClient: boolean) => `/partners/suppliers/updateStatus/${id}?statusClient=${statusClient}`,

  purchaseOrder: "/purchase-orders",
  getPurchaseOrders:(query? : GetListParams)=> `/purchase-orders/${buildQueryString(query)}`,
  purchaseOrderById: (id : string) => `/purchase-orders/${id}`,
  getPurchaseOrderByIdPartner:(id: string,partnerType:string) => `/purchase-orders/partner/${id}?partnerType=${partnerType}`,

  uploadSupplierDocument: (idPartner: string, partnerDocumentType:PartnerDocumentType)=>`/partners/suppliers/documents/upload/${idPartner}?partnerDocumentType=${partnerDocumentType}`,

  uploadClientDocument: (idPartner: string, partnerDocumentType:PartnerDocumentType)=>`/partners/clients/documents/upload/${idPartner}?partnerDocumentType=${partnerDocumentType}`,

  uploadDocument: "/documents/upload",
};

export const INVOICES_ENDPOINTS={
  clientsInvoices: "/invoices/client-invoices",
  suppliersInvoices: "/invoices/supplier-invoices",
  nextNumber: "/invoices/next-number",
  getClientsInvoices: (query? : GetListParams)=> `/invoices/client-invoices${buildQueryString(query)}`,
  getClientsInvoicesToPay: (keyword? : string)=> `/invoices/client-invoices/to-pay?${keyword}`,
  getClientTopInvoices: (id: string)=>`/invoices/client-invoices/client/${id}`,
  getSuppliersInvoices: (query? : GetListParams)=> `/invoices/supplier-invoices${buildQueryString(query)}`,
  getSupplierTopInvoices: (id: string)=>`/invoices/supplier-invoices/supplier/${id}`,
  clientInvoiceById: (id?: string) => `/invoices/client-invoices/${id}`,
  clientInvoiceStatusById: (id?: string) => `/invoices/client-invoices/${id}/status`,
  supplierInvoiceStatusById: (id?: string) => `/invoices/supplier-invoices/${id}/status`,
  allClientInvoicesStats : '/invoices/client-invoices/stats',
  allSupplierInvoicesStats : '/invoices/supplier-invoices/stats',
  clientInvoiceStats: (id?: string) => `/invoices/client-invoices/stats/${id}`,
  supplierInvoiceStats: (id?: string) => `/invoices/supplier-invoices/stats/${id}`,

  supplierInvoiceById: (id: string) => `/invoices/supplier-invoices/${id}`,

  supplierInvoiceItemById: (id: string) => `/invoices/supplier-invoices/item/${id}`,

  clientInvoiceItemById: (id?: string) => `/invoices/client-invoices/item/${id}`,

  clientInvoicesById: (id: string) => `/invoices/clients/${id}`,
  supplierInvoicesById: (id: string) => `/invoices/suppliers/${id}`,

  clientInvoicesByIdPartner: (id: string, query? : GetListParams) => `/invoices/last/client-invoices/${id}${buildQueryString(query)}`,

  supplierInvoicesByIdPartner: (id: string, query? : GetListParams) => `/invoices/last/supplier-invoices/${id}${buildQueryString(query)}`,
}

export const INVOICES_CREDIT_NOTE_ENDPOINTS={
  invoiceCreditNotes: "/credit-note-invoices/",
  nextNumber: "/credit-note-invoices/next-number",

  //getInvoiceCreditNotes: (query? : GetPartnersParams)=> `/credit-note-invoices/invoice/${buildQueryString(query)}`,
  getInvoiceCreditNotes: (id : string, query?:GetListParams)=> `/credit-note-invoices/invoice/${id}${buildQueryString(query)}`,
  invoiceCreditNoteById: (id?: string) => `/credit-note-invoices/${id}`,
  updateStatusInvoiceCreditNote: (id: string)=> `/credit-note-invoices/${id}/status`,

  getInvoiceCreditNoteByIdPartner: (idPartner?: string, partnerType?:string, query? : GetListParams) => `/credit-note-invoices/getPartnerCreditNote/${idPartner}${buildQueryString(query)}&partnerType=${partnerType}`,
}

export const PURCHASE_ORDER_ENDPOINTS = {
  purchaseOrders: "/purchase-orders/",
  nextNumber: "/purchase-orders/next-number",
  summary:"/purchase-orders/summary",
  updateSupplierPurchaseOrder : "/purchase-orders/supplier",
  getPurchaseOrders: (query? : GetListParams)=> `/purchase-orders/${buildQueryString(query)}`,
  purchaseOrderById: (id?: string) => `/purchase-orders/${id}`, 
  updateStatusPurchaseOrder: (id: string)=> `/purchase-orders/${id}/status`,

  supplierPurchaseOrders: "/purchase-orders/supplier",
  supplierSummary:"/purchase-orders/supplier/summary",
  getSupplierPurchaseOrders: (query? : GetListParams)=> `/purchase-orders/supplier${buildQueryString(query)}`,
  supplierPurchaseOrderById: (id: string) => `/purchase-orders/supplier/${id}`, 
  supplierupdateStatusPurchaseOrder: (id: string)=> `/purchase-orders/supplier/${id}/status`,

  getPurchaseOrderByIdPartner:(id: string,  partnerType:string, query? : GetListParams) => `/purchase-orders/partner/${id}${buildQueryString(query)}&partnerType=${partnerType}`,

 
}

export const EXCHANGE_RATE_ENDPOINTS = {
  exchangeRate: "/exchange-rate/content",
  getExchangeRate: (query? : ExchangeRateParams)=> `/exchange-rate/content${buildQueryString(query)}`,

}

export const PAYMENT_ENDPIONTS={
  payment:"/payments/",
  nextNumber: "/payments/next-number",
  getPayments: (query?: GetListParams)=>`/payments${buildQueryString(query)}`,
  getPaymentsByIdInvoice: (id: string, query?: GetListParams)=>`/payments/invoice/${id}${buildQueryString(query)}`,
  getPaymentsByIdParner: (id: string, query?: GetListParams)=>`/payments/partner/${id}${buildQueryString(query)}`,
  paymentById: (id: string)=>`/payments/${id}`
}

export const DASHBOARD_ENDPOINTS={
  dashboard : '/dashboard',
  statsClientsInvoices: '/dashboard/clients-invoices',
  statsSuppliersInvoices: '/dashboard/suppliers-invoices',
  getClientRevenue: (idPartner: string, period: string) => `/dashboard/client-revenue/${idPartner}?period=${period}`,
  getSupplierRevune: (idPartner: string, period : string) => `/dashboard/supplier-despenses/${idPartner}?period=${period}`,
  getAllClientReveune: '/dashboard/all-client-revenue',
}

export const MAILING_ENDPOINTS={
  mailing:'/mailing',
  sendSimpleEmail:`/mailing/send-email`,
  getEmailById: (id: string )=>`/mailing/mail/${id}`,
  getEmailsByPartner:(email: string, query : GetListParams )=>`/mailing/partner/${email}${buildQueryString(query)}`,
  sendEmailInvoice:(id: string )=>`/mailing/invoice/${id}/send-email`,
  sendEmailCreditNote:(id: string )=>`/mailing/creditNote/${id}/send-email`,
  sendEmailPurchaseOrder:(id: string )=>`/mailing/purchase-order/${id}/send-email`,
  sendEmailPayment: (id: string )=>`/mailing/payment/${id}/send-email`,

}
export const  AUDITLOGS_ENDPOINTS = {
 getAuditLogsByIdClient: (id: string) => `/logs/logs-clients/${id}`, 
 getAuditLogsByIdSupplier: (id: string) => `/logs/logs-suppliers/${id}`, 
}  

export const OPERATION_CATEGORY_ENDPOINTS = {
  getAllOperationCategories: "/operation-categories",

  getAllActiveOperationCategories: "/operation-categories/active",

  getOperationCategory: (id: string) => `/operation-categories/${id}`,

  getOperationCategoryByCode: (code: string) =>
    `/operation-categories/code/${code}`,

  getOperationCategoryByLabel: (label: string) =>
    `/operation-categories/label/${label}`,

  createOperationCategory:  "/operation-categories",

  updateOperationCategory: (id: string) =>
    `/operation-categories/${id}`,

  activateOperationCategory: (id: string) =>
    `/operation-categories/${id}/activate`,

  deactivateOperationCategory: (id: string) =>
    `/operation-categories/${id}/deactivate`
}

export const PAYMENT_CONDITION_ENDPOINTS = {
  getAllPaymentConditions: "/payment-conditions",

  getAllActivePaymentConditions: "/payment-conditions/active",

  getPaymentCondition: (id: string) => `/payment-conditions/${id}`,

  getPaymentConditionByCode: (code: string) =>
    `/payment-conditions/code/${code}`,

  getPaymentConditionByLabel: (label: string) =>
    `/payment-conditions/label/${label}`,

  createPaymentCondition: "/payment-conditions",

  updatePaymentCondition: (id: string) =>
    `/payment-conditions/${id}`,

  activatePaymentCondition: (id: string) =>
    `/payment-conditions/${id}/activate`,

  deactivatePaymentCondition: (id: string) =>
    `/payment-conditions/${id}/deactivate`
}

export const TVA_RATE_ENDPOINTS = {
  getAllTvaRates: "/tva-rates",

  getAllActiveTvaRates: "/tva-rates/active",

  getTvaRate: (id: string) => `/tva-rates/${id}`,

  getTvaRateByCode: (code: string) =>
    `/tva-rates/code/${code}`,

  getTvaRateByLabel: (label: string) =>
    `/tva-rates/label/${label}`,

  createTvaRate: "/tva-rates",

  updateTvaRate: (id: string) =>
    `/tva-rates/${id}`,

  activateTvaRate: (id: string) =>
    `/tva-rates/${id}/activate`,

  deactivateTvaRate: (id: string) =>
    `/tva-rates/${id}/deactivate`
}