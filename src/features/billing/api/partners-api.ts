// src/features/billing/api/partners.api.ts
import { apiClient } from "@/shared/api/api-client";
import { AUDITLOGS_ENDPOINTS, BILLING_ENDPOINTS, DASHBOARD_ENDPOINTS, EXCHANGE_RATE_ENDPOINTS, INVOICES_CREDIT_NOTE_ENDPOINTS, INVOICES_ENDPOINTS, MAILING_ENDPOINTS, OPERATION_CATEGORY_ENDPOINTS, PAYMENT_CONDITION_ENDPOINTS, PAYMENT_ENDPIONTS, PURCHASE_ORDER_ENDPOINTS, TVA_RATE_ENDPOINTS } from "@/shared/api/endpoints";
import { ExchangeRateParams, GetListParams, PageResponse } from "@/shared/api/types";
import { InvoiceCreditNoteCreate, InvoiceCreditNoteDetails, InvoiceCreditNotePageItem } from "../models/creditNote";
import { Invoice, InvoiceCreate, InvoicePageItem, } from "../models/invoice";
import {   ClientPartnerItem, CreatePartner, PartnerAllDetails, PartnerSummary,  SupplierPartnerItem, UpdatePartner } from "../models/partner";
import { PurchaseOrderCreate, PurchaseOrderDetails, PurchaseOrderPageItem,  PurchaseOrderPartnerSummary,  PurchaseOrderSummary, PurchaseOrderUpdate } from "../models/purchaseOrder";
import { ExchangeRate } from "../types/exchangeRate";
import { nextNumber } from "../types/nextNumber";
import { PartnerInvoiceStats } from "../types/partnersStats";
import { ClientInvoiceDashboardStats } from "../types/clientDashboardStats";
import { SendMail } from "../types/sendEmail";
import { AuditLog } from "../models/AuditLogs";
import {  Payment, PaymentDetails, PaymentListItem } from "../models/payment";
import { PartnerRevenueStats } from "../types/partnerRevenueStats";
import { EmailLog, EmailLogDetails } from "../types/emailLog";
import { PartnerDocumentType } from "../types/documentType";
import { TVARate, TVARatePageItem } from "../models/TVArate";
import { PaymentCondition, PaymentConditionPageItem } from "../models/paymentCondition";
import { OperationCategory, OperationCategoryPageItem } from "../models/operationCategory";

export const partnersApi = {

  getClients: (query? : GetListParams) => 
    apiClient.get<PageResponse<ClientPartnerItem>>(BILLING_ENDPOINTS.getClients(query)),

  getSummaryClients: (query? : GetListParams) =>
    apiClient.get<PartnerSummary[]>(BILLING_ENDPOINTS.getClientsSummary(query)),

  getSummarySuppliers: (query? : GetListParams) =>
    apiClient.get<PartnerSummary[]>(BILLING_ENDPOINTS.getSuppliersSummary(query)),

  getSuppliers: (query? : GetListParams) => 
    apiClient.get<PageResponse<SupplierPartnerItem>>(BILLING_ENDPOINTS.getSuppliers(query)),

  getClientById: (id: string) =>
    apiClient.get<PartnerAllDetails>(BILLING_ENDPOINTS.clientById(id)),

  getSupplierById: (id: string) =>
    apiClient.get<PartnerAllDetails>(BILLING_ENDPOINTS.supplierById(id)),

  createClient: (payload: FormData) =>
    apiClient.post<CreatePartner>(BILLING_ENDPOINTS.clients, payload),

  createSupplier: (payload: FormData) =>
    apiClient.post<CreatePartner>(BILLING_ENDPOINTS.suppliers, payload),

  uploadSupplierDocument : (idPartner: string, documentType: PartnerDocumentType,  payload: FormData)=> 
    apiClient.post(BILLING_ENDPOINTS.uploadSupplierDocument(idPartner, documentType), payload),

  uploadClientDocument : (idPartner: string, documentType: PartnerDocumentType,  payload: FormData)=> 
    apiClient.post(BILLING_ENDPOINTS.uploadClientDocument(idPartner, documentType), payload),

  updateClient : (id: string, payload: FormData) => apiClient.patch<UpdatePartner>(BILLING_ENDPOINTS.clientById(id), payload),


  updateSupplier : (id: string, payload: FormData) => apiClient.patch<UpdatePartner>(BILLING_ENDPOINTS.supplierById(id), payload),

  updateStatus : (id: string, statusClient: boolean) => apiClient.patch<void>(BILLING_ENDPOINTS.updatestatus(id,statusClient)),

  updateSupplierStatus : (id: string, statusClient: boolean) => apiClient.patch<void>(BILLING_ENDPOINTS.updateSupplierstatus(id,statusClient)),

  deleteClient: (id: string) =>
    apiClient.delete<void>(BILLING_ENDPOINTS.clientById(id)),

  deleteSupplier: (id: string) =>
    apiClient.delete<void>(BILLING_ENDPOINTS.supplierById(id)),

  getSupplierInvoicesById: (id: string) =>
    apiClient.get<PageResponse<InvoicePageItem[]>>(BILLING_ENDPOINTS.getSuppliersInvoices(id)),

  getClientsInvoicesById: (id: string) =>
    apiClient.get<PageResponse<InvoicePageItem[]>>(BILLING_ENDPOINTS.getClientsInvoices(id)),


  getPurchaseOrderByPartnerId:(id :string, partnerType: string, query? : GetListParams) => 
    apiClient.get<PageResponse<PurchaseOrderPartnerSummary>>(PURCHASE_ORDER_ENDPOINTS.getPurchaseOrderByIdPartner(id, partnerType, query )),
};

export const InvoicesAPI = {
  getNextInvoiceNumber :()=> apiClient.get<nextNumber>(INVOICES_ENDPOINTS.nextNumber),

  getClientsInvoices: (query? : GetListParams) => 
    apiClient.get<PageResponse<InvoicePageItem>>(INVOICES_ENDPOINTS.getClientsInvoices(query)),

  getClientsInvoicesToPay: (query? : string) => 
    apiClient.get<InvoicePageItem[]>(INVOICES_ENDPOINTS.getClientsInvoicesToPay(query)),

  getClientTopInvoices: (idClient: string)=> apiClient.get<InvoicePageItem[]>(INVOICES_ENDPOINTS.getClientTopInvoices(idClient)),

  getSuppliersInvoices: (query? : GetListParams) => 
    apiClient.get<PageResponse<InvoicePageItem>>(INVOICES_ENDPOINTS.getSuppliersInvoices(query)),

  getSupplierTopInvoices: (idSupplier: string)=> apiClient.get<InvoicePageItem[]>(INVOICES_ENDPOINTS.getSupplierTopInvoices(idSupplier)),

  getClientInvoiceById: (id?: string) =>
    apiClient.get<Invoice>(INVOICES_ENDPOINTS.clientInvoiceById(id)),

  getSupplierInvoiceById: (id: string) =>
    apiClient.get<Invoice>(INVOICES_ENDPOINTS.supplierInvoiceById(id)),


  getClientInvoiceItemById: (id?: string) =>
    apiClient.get<InvoicePageItem>(INVOICES_ENDPOINTS.clientInvoiceItemById(id)),

  getSupplierInvoiceItemById: (id: string) =>
    apiClient.get<InvoicePageItem>(INVOICES_ENDPOINTS.supplierInvoiceItemById(id)),


  getClientInvoiceStats: (id: string) =>
    apiClient.get<PartnerInvoiceStats>(INVOICES_ENDPOINTS.clientInvoiceStats(id)),

  getAllClientInvoiceStats: () =>
    apiClient.get<PartnerInvoiceStats>(INVOICES_ENDPOINTS.allClientInvoicesStats),

  getAllSupplierInvoiceStats: () =>
    apiClient.get<PartnerInvoiceStats>(INVOICES_ENDPOINTS.allSupplierInvoicesStats),

  getSupplierInvoiceStats: (id: string) =>
    apiClient.get<PartnerInvoiceStats>(INVOICES_ENDPOINTS.supplierInvoiceStats(id)),

  createClientInvoice: (payload: FormData) =>
    apiClient.post<InvoiceCreate>(INVOICES_ENDPOINTS.clientsInvoices, payload),

  createSupplierInvoice: (payload: FormData) =>
    apiClient.post<InvoiceCreate>(INVOICES_ENDPOINTS.suppliersInvoices, payload),

  updateClientInvoice : (id: string, payload: FormData) => apiClient.patch<Invoice>(INVOICES_ENDPOINTS.clientsInvoices, payload),

  updateClientInvoiceStatus : 
  (id: string, payload: FormData) => apiClient.patch<Invoice>(INVOICES_ENDPOINTS.clientInvoiceStatusById(id), payload),

  updateSupplierInvoiceStatus : 
  (id: string, payload: FormData) => apiClient.patch<Invoice>(INVOICES_ENDPOINTS.supplierInvoiceStatusById(id), payload),

  updateSupplierInvoice : (id: string, payload: FormData) => apiClient.patch<Invoice>(INVOICES_ENDPOINTS.suppliersInvoices, payload),

  deleteClientInvoice: (id: string) =>
    apiClient.delete<void>(INVOICES_ENDPOINTS.clientInvoiceById(id)),

  deleteSupplierInvoice: (id: string) =>
    apiClient.delete<void>(INVOICES_ENDPOINTS.supplierInvoiceById(id)),

  
  getSupplierInvoicesByIdPartner: (id: string, query? : GetListParams) =>
    apiClient.get<PageResponse<InvoicePageItem[]>>(INVOICES_ENDPOINTS.supplierInvoicesByIdPartner(id, query)),

  getClientsInvoicesByIdPartner: (id: string, query? : GetListParams) =>
    apiClient.get<PageResponse<InvoicePageItem[]>>(INVOICES_ENDPOINTS.clientInvoicesByIdPartner(id, query)),
};

export const InvoicesCreditNoteAPI = {
  getNextInvoiceNumber :()=> apiClient.get<nextNumber>(INVOICES_CREDIT_NOTE_ENDPOINTS.nextNumber),

  getInvoiceCreditNotes: (id : string, query?:GetListParams) => 
    apiClient.get<PageResponse<InvoiceCreditNotePageItem>>(INVOICES_CREDIT_NOTE_ENDPOINTS.getInvoiceCreditNotes(id, query)),

  getCreditNoteById: (id: string) =>
    apiClient.get<InvoiceCreditNoteDetails>(INVOICES_CREDIT_NOTE_ENDPOINTS.invoiceCreditNoteById(id)),

  createInvoiceCreditNote: (payload: FormData) =>
    apiClient.post<InvoiceCreditNoteCreate>(INVOICES_CREDIT_NOTE_ENDPOINTS.invoiceCreditNotes, payload),

  deleteInvoiceCreditNote: (id: string) =>
    apiClient.delete<void>(INVOICES_CREDIT_NOTE_ENDPOINTS.invoiceCreditNoteById(id)),

   getInvoiceCreditNoteByIdClient: (id: string,partnerType : string,  query?:GetListParams) =>
    apiClient.get<PageResponse<InvoiceCreditNotePageItem>>(INVOICES_CREDIT_NOTE_ENDPOINTS.getInvoiceCreditNoteByIdPartner(id,partnerType, query)),

   getInvoiceCreditNoteByIdSupplier: (id: string,partnerType : string,  query?:GetListParams) =>
    apiClient.get<PageResponse<InvoiceCreditNotePageItem>>(INVOICES_CREDIT_NOTE_ENDPOINTS.getInvoiceCreditNoteByIdPartner(id,partnerType, query)),

  updateInvoiceCreditNoteStatus : 
  (id: string, payload: FormData) => apiClient.patch<InvoiceCreditNoteDetails>(INVOICES_CREDIT_NOTE_ENDPOINTS.updateStatusInvoiceCreditNote(id), payload),
};

export const PurchaseOrderAPI = {
  getNextPurchaseOrderNumber :()=> apiClient.get<nextNumber>(PURCHASE_ORDER_ENDPOINTS.nextNumber),

  getClientsPurchaseOrders: (query? : GetListParams) => 
    apiClient.get<PageResponse<PurchaseOrderPageItem>>(PURCHASE_ORDER_ENDPOINTS.getPurchaseOrders(query)),

  getSuppliersPurchaseOrders: (query? : GetListParams) => 
    apiClient.get<PageResponse<PurchaseOrderPageItem>>(PURCHASE_ORDER_ENDPOINTS.getSupplierPurchaseOrders(query)),

  getPurchaseOrderSummary :() => apiClient.get<PurchaseOrderSummary[]>(PURCHASE_ORDER_ENDPOINTS.summary),

  getSupplierPurchaseOrderSummary :() => apiClient.get<PurchaseOrderSummary[]>(PURCHASE_ORDER_ENDPOINTS.supplierSummary),

  getClientPurchaseOrderById: (id?: string) =>
    apiClient.get<PurchaseOrderDetails>(PURCHASE_ORDER_ENDPOINTS.purchaseOrderById(id)),

  getSupplierPurchaseOrderById: (id: string) =>
    apiClient.get<PurchaseOrderDetails>(PURCHASE_ORDER_ENDPOINTS.supplierPurchaseOrderById(id)),

  createClientPurchaseOrder: (payload: FormData) =>
    apiClient.post<PurchaseOrderCreate>(PURCHASE_ORDER_ENDPOINTS.purchaseOrders, payload),

  createSupplierPurchaseOrder: (payload: FormData) =>
    apiClient.post<PurchaseOrderCreate>(PURCHASE_ORDER_ENDPOINTS.supplierPurchaseOrders, payload),

  updateClientPurchaseOrder : (id: string, payload: FormData) => apiClient.patch<PurchaseOrderUpdate>(PURCHASE_ORDER_ENDPOINTS.purchaseOrders, payload),

  updatePurchaseOrderStatus : 
  (id: string, payload: FormData) => apiClient.patch<PurchaseOrderDetails>(PURCHASE_ORDER_ENDPOINTS.updateStatusPurchaseOrder(id), payload),

  updateSupplierPurchaseOrderStatus : 
  (id: string, payload: FormData) => apiClient.patch<PurchaseOrderDetails>(PURCHASE_ORDER_ENDPOINTS.supplierupdateStatusPurchaseOrder(id), payload),

  updateSupplierPurchaseOrder : 
  ( payload: FormData) => apiClient.patch<PurchaseOrderUpdate>(PURCHASE_ORDER_ENDPOINTS.updateSupplierPurchaseOrder, payload),

  deleteClientPurchaseOrder: (id: string) =>
    apiClient.delete<void>(PURCHASE_ORDER_ENDPOINTS.purchaseOrderById(id)),

  deleteSupplierPurchaseOrder: (id: string) =>
    apiClient.delete<void>(PURCHASE_ORDER_ENDPOINTS.supplierPurchaseOrderById(id)),
};

export const paymentsAPI = {
  getNextPaymentNumber :()=> apiClient.get<nextNumber>(PAYMENT_ENDPIONTS.nextNumber),

  getPayments: (query? : GetListParams) => 
    apiClient.get<PageResponse<PaymentListItem>>(PAYMENT_ENDPIONTS.getPayments(query)),

  getPaymentsByInvoivce: (id:string, query? : GetListParams)=> 
    apiClient.get<PageResponse<PaymentListItem>>(PAYMENT_ENDPIONTS.getPaymentsByIdInvoice(id, query)),

  getPaymentsByPartner: (id:string, query? : GetListParams)=> 
    apiClient.get<PageResponse<PaymentListItem>>(PAYMENT_ENDPIONTS.getPaymentsByIdParner(id, query)),

  createPayment : (data: FormData)=>
    apiClient.post<Payment>(PAYMENT_ENDPIONTS.payment, data),

  updatePayment: (id: string, payload: FormData) => apiClient.patch<Payment>(PAYMENT_ENDPIONTS.paymentById(id), payload),

  deletePayment: (id: string)=> 
    apiClient.delete<void>(PAYMENT_ENDPIONTS.paymentById(id)),

  getPaymentDetails: (id: string)=> 
    apiClient.get<PaymentDetails>(PAYMENT_ENDPIONTS.paymentById(id))
}

export const ExchangeRateAPI = {
  getExchangeRate: (query? : ExchangeRateParams) => 
    apiClient.get<ExchangeRate>(EXCHANGE_RATE_ENDPOINTS.getExchangeRate(query)),

};

export const DashboardAPI = {
  clientDashbordStats: ()=> apiClient.get<ClientInvoiceDashboardStats[]>(DASHBOARD_ENDPOINTS.statsClientsInvoices),
  supplierDashbordStats: ()=> apiClient.get<ClientInvoiceDashboardStats[]>(DASHBOARD_ENDPOINTS.statsSuppliersInvoices),
  clientRevenueStats: (idPartner: string , period : string)=>apiClient.get<PartnerRevenueStats[]>(DASHBOARD_ENDPOINTS.getClientRevenue(idPartner,period)),
  supplierRevenueStats: (idPartner: string , period : string)=>apiClient.get<PartnerRevenueStats[]>(DASHBOARD_ENDPOINTS.getSupplierRevune(idPartner,period)),
}

export const MailingAPI ={

  getEmailsByPartner: (email: string, query: GetListParams)=> 
    apiClient.get<PageResponse<EmailLog>>(MAILING_ENDPOINTS.getEmailsByPartner(email, query)),

  getEmailsById: (id: string)=> 
    apiClient.get<EmailLogDetails>(MAILING_ENDPOINTS.getEmailById(id)),
  
  sendEmailWithInvoice : (idInvoice: string, payload: SendMail)=> apiClient.post(MAILING_ENDPOINTS.sendEmailInvoice(idInvoice), payload),

  sendEmailWithCreditNote : (idInvoice: string, payload: SendMail)=> apiClient.post(MAILING_ENDPOINTS.sendEmailCreditNote(idInvoice), payload),

  sendEmailWithPurchaseOrder : (idInvoice: string, payload: SendMail)=> apiClient.post(MAILING_ENDPOINTS.sendEmailPurchaseOrder(idInvoice), payload),

  sendEmailWithPayment : (idInvoice: string, payload: SendMail)=> apiClient.post(MAILING_ENDPOINTS.sendEmailPayment(idInvoice), payload),

  sendEmail : (payload: SendMail)=> apiClient.post(MAILING_ENDPOINTS.sendSimpleEmail, payload),

}
export const AuditLogAPI = {
  getAuditLogs: (id: string)=> apiClient.get<AuditLog[]>(AUDITLOGS_ENDPOINTS.getAuditLogsByIdClient(id)),
  getAuditLogsBySupplier: (id: string)=> apiClient.get<AuditLog[]>(AUDITLOGS_ENDPOINTS.getAuditLogsByIdSupplier(id))
}

export const OperationCategoryAPI = {
  
  getAllOperationCategories: () => apiClient.get<OperationCategoryPageItem[]>(OPERATION_CATEGORY_ENDPOINTS.getAllOperationCategories),

  getAllActiveOperationCategories: () => apiClient.get<OperationCategoryPageItem[]>(OPERATION_CATEGORY_ENDPOINTS.getAllActiveOperationCategories),

  getOperationCategory: (id: string) => apiClient.get<OperationCategory>(OPERATION_CATEGORY_ENDPOINTS.getOperationCategory(id)),

  getOperationCategoryByCode: (code: string) => apiClient.get<OperationCategory>(OPERATION_CATEGORY_ENDPOINTS.getOperationCategoryByCode(code)),

  getOperationCategoryByLabel: (label: string) => apiClient.get<OperationCategory>(OPERATION_CATEGORY_ENDPOINTS.getOperationCategoryByLabel(label)),

  createOperationCategory: (payload: FormData) => apiClient.post<OperationCategory>(OPERATION_CATEGORY_ENDPOINTS.createOperationCategory, payload),

  updateOperationCategory: (id: string, payload: FormData) => apiClient.put<OperationCategory>(OPERATION_CATEGORY_ENDPOINTS.updateOperationCategory(id), payload),

  activateOperationCategory: (id: string) => apiClient.patch<void>(OPERATION_CATEGORY_ENDPOINTS.activateOperationCategory(id)),

  deactivateOperationCategory: (id: string) =>apiClient.patch<void>(OPERATION_CATEGORY_ENDPOINTS.deactivateOperationCategory(id))
}

export const PaymentConditionAPI = {
  getAllPaymentConditions: () => apiClient.get<PaymentConditionPageItem[]>(PAYMENT_CONDITION_ENDPOINTS.getAllPaymentConditions),

  getAllActivePaymentConditions: () => apiClient.get<PaymentConditionPageItem[]>(PAYMENT_CONDITION_ENDPOINTS.getAllActivePaymentConditions),

  getPaymentCondition: (id: string) => apiClient.get<PaymentCondition>(PAYMENT_CONDITION_ENDPOINTS.getPaymentCondition(id)),

  getPaymentConditionByCode: (code: string) => apiClient.get<PaymentCondition>(PAYMENT_CONDITION_ENDPOINTS.getPaymentConditionByCode(code)),

  getPaymentConditionByLabel: (label: string) => apiClient.get<PaymentCondition>(PAYMENT_CONDITION_ENDPOINTS.getPaymentConditionByLabel(label)),

  createPaymentCondition: (payload: FormData) => apiClient.post<PaymentCondition>(PAYMENT_CONDITION_ENDPOINTS.createPaymentCondition, payload),

  updatePaymentCondition: (id: string, payload: FormData) => apiClient.put<PaymentCondition>(PAYMENT_CONDITION_ENDPOINTS.updatePaymentCondition(id), payload),

  activatePaymentCondition: (id: string) => apiClient.patch<void>(PAYMENT_CONDITION_ENDPOINTS.activatePaymentCondition(id)),

  deactivatePaymentCondition: (id: string) =>apiClient.patch<void>(PAYMENT_CONDITION_ENDPOINTS.deactivatePaymentCondition(id))
}

export const TvaRateAPI = {
  getAllTvaRates: () => apiClient.get<TVARatePageItem[]>(TVA_RATE_ENDPOINTS.getAllTvaRates),

  getAllActiveTvaRates: () => apiClient.get<TVARatePageItem[]>(TVA_RATE_ENDPOINTS.getAllActiveTvaRates),

  getTvaRate: (id: string) => apiClient.get<TVARate>(TVA_RATE_ENDPOINTS.getTvaRate(id)),

  getTvaRateByCode: (code: string) => apiClient.get<TVARate>(TVA_RATE_ENDPOINTS.getTvaRateByCode(code)),

  getTvaRateByLabel: (label: string) => apiClient.get<TVARate>(TVA_RATE_ENDPOINTS.getTvaRateByLabel(label)),

  createTvaRate: (payload: FormData) => apiClient.post<TVARate>(TVA_RATE_ENDPOINTS.createTvaRate, payload),

  updateTvaRate: (id: string, payload: FormData) => apiClient.put<TVARate>(TVA_RATE_ENDPOINTS.updateTvaRate(id), payload),

  activateTvaRate: (id: string) => apiClient.patch<void>(TVA_RATE_ENDPOINTS.activateTvaRate(id)),

  deactivateTvaRate: (id: string) =>apiClient.patch<void>(TVA_RATE_ENDPOINTS.deactivateTvaRate(id))
}