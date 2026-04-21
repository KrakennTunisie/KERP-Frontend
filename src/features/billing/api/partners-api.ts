// src/features/billing/api/partners.api.ts
import { apiClient, RequestBody } from "@/shared/api/api-client";
import { BILLING_ENDPOINTS, EXCHANGE_RATE_ENDPOINTS, INVOICES_CREDIT_NOTE_ENDPOINTS, INVOICES_ENDPOINTS, PURCHASE_ORDER_ENDPOINTS } from "@/shared/api/endpoints";
import { ClientPartner, ClientPartnerItem, CreateClientPartner, CreateSupplierPartner, PartnerSummary, SupplierPartner, SupplierPartnerItem, UpdatePartner } from "../models/partner";
import { ExchangeRateParams,  GetListParams, PageResponse } from "@/shared/api/types";
import { nextNumber } from "../types/nextNumber";
import { Invoice, InvoiceCreate, InvoicePageItem } from "../models/invoice";
import { InvoiceCreditNote, InvoiceCreditNoteCreate, InvoiceCreditNoteDetails, InvoiceCreditNotePageItem } from "../models/creditNote";
import { UpdateInvoiceCreditNoteStatusRequest } from "../types/UpdateInvoiceCreditNoteStatusRequest";
import { ExchangeRate } from "../types/exchangeRate";

export const partnersApi = {
  getClients: (query? : GetListParams) => 
    apiClient.get<PageResponse<ClientPartnerItem>>(BILLING_ENDPOINTS.getClients(query)),
  getSummaryClients: (query? : GetListParams) =>
    apiClient.get<PartnerSummary[]>(BILLING_ENDPOINTS.getClientsSummary(query)),

  getSuppliers: (query? : GetListParams) => 
    apiClient.get<PageResponse<SupplierPartnerItem>>(BILLING_ENDPOINTS.getSuppliers(query)),

  getClientById: (id: string) =>
    apiClient.get<ClientPartner>(BILLING_ENDPOINTS.clientById(id)),

  getSupplierById: (id: string) =>
    apiClient.get<SupplierPartner>(BILLING_ENDPOINTS.supplierById(id)),

  createClient: (payload: FormData) =>
    apiClient.post<CreateClientPartner>(BILLING_ENDPOINTS.clients, payload),

  createSupplier: (payload: FormData) =>
    apiClient.post<CreateSupplierPartner>(BILLING_ENDPOINTS.suppliers, payload),

  updateClient : (id: string, payload: UpdatePartner) => apiClient.patch<UpdatePartner>(BILLING_ENDPOINTS.clientById(id), payload),

  updateSupplier : (id: string, payload: UpdatePartner) => apiClient.patch<UpdatePartner>(BILLING_ENDPOINTS.supplierById(id), payload),

  deleteClient: (id: string) =>
    apiClient.delete<void>(BILLING_ENDPOINTS.clientById(id)),

  deleteSupplier: (id: string) =>
    apiClient.delete<void>(BILLING_ENDPOINTS.supplierById(id)),
};

export const InvoicesAPI = {
  getNextInvoiceNumber :()=> apiClient.get<nextNumber>(INVOICES_ENDPOINTS.nextNumber),

  getClientsInvoices: (query? : GetListParams) => 
    apiClient.get<PageResponse<InvoicePageItem>>(INVOICES_ENDPOINTS.getClientsInvoices(query)),

  getSuppliersInvoices: (query? : GetListParams) => 
    apiClient.get<PageResponse<InvoicePageItem>>(INVOICES_ENDPOINTS.getSuppliersInvoices(query)),

  getClientInvoiceById: (id?: string) =>
    apiClient.get<Invoice>(INVOICES_ENDPOINTS.clientInvoiceById(id)),

  getSupplierInvoiceById: (id: string) =>
    apiClient.get<Invoice>(INVOICES_ENDPOINTS.supplierInvoiceById(id)),

  createClientInvoice: (payload: FormData) =>
    apiClient.post<InvoiceCreate>(INVOICES_ENDPOINTS.clientsInvoices, payload),

  createSupplierInvoice: (payload: FormData) =>
    apiClient.post<InvoiceCreate>(INVOICES_ENDPOINTS.suppliersInvoices, payload),

  updateClientInvoice : (id: string, payload: FormData) => apiClient.patch<Invoice>(INVOICES_ENDPOINTS.clientsInvoices, payload),

  updateClientInvoiceStatus : 
  (id: string, payload: FormData) => apiClient.patch<Invoice>(INVOICES_ENDPOINTS.clientInvoiceStatusById(id), payload),

  updateSupplierInvoice : (id: string, payload: FormData) => apiClient.patch<Invoice>(INVOICES_ENDPOINTS.suppliersInvoices, payload),

  deleteClientInvoice: (id: string) =>
    apiClient.delete<void>(INVOICES_ENDPOINTS.clientInvoiceById(id)),

  deleteSupplierInvoice: (id: string) =>
    apiClient.delete<void>(INVOICES_ENDPOINTS.supplierInvoiceById(id)),
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

  updateInvoiceCreditNoteStatus : 
  (id: string, payload: FormData) => apiClient.patch<InvoiceCreditNoteDetails>(INVOICES_CREDIT_NOTE_ENDPOINTS.updateStatusInvoiceCreditNote(id), payload),
};

export const PurchaseOrderAPI = {
  getNextInvoiceNumber :()=> apiClient.get(PURCHASE_ORDER_ENDPOINTS.nextNumber),

  getClientsPurchaseOrders: (query? : GetListParams) => 
    apiClient.get<PageResponse<ClientPartnerItem>>(PURCHASE_ORDER_ENDPOINTS.getPurchaseOrders(query)),

  getSuppliersPurchaseOrders: (query? : GetListParams) => 
    apiClient.get<PageResponse<SupplierPartnerItem>>(PURCHASE_ORDER_ENDPOINTS.getPurchaseOrders(query)),

  getClientPurchaseOrderById: (id: string) =>
    apiClient.get<ClientPartner>(PURCHASE_ORDER_ENDPOINTS.purchaseOrderById(id)),

  getSupplierPurchaseOrderById: (id: string) =>
    apiClient.get<SupplierPartner>(PURCHASE_ORDER_ENDPOINTS.purchaseOrderById(id)),

  createClientPurchaseOrder: (payload: FormData) =>
    apiClient.post<CreateClientPartner>(PURCHASE_ORDER_ENDPOINTS.purchaseOrders, payload),

  updateClientPurchaseOrder : (id: string, payload: UpdatePartner) => apiClient.patch<UpdatePartner>(PURCHASE_ORDER_ENDPOINTS.purchaseOrderById(id), payload),

  deleteClientPurchaseOrder: (id: string) =>
    apiClient.delete<void>(PURCHASE_ORDER_ENDPOINTS.purchaseOrderById(id)),

  deletePurchaseOrder: (id: string) =>
    apiClient.delete<void>(PURCHASE_ORDER_ENDPOINTS.purchaseOrderById(id)),
};

export const ExchangeRateAPI = {

  getExchangeRate: (query? : ExchangeRateParams) => 
    apiClient.get<ExchangeRate>(EXCHANGE_RATE_ENDPOINTS.getExchangeRate(query)),

};