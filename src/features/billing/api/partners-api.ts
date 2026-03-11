// src/features/billing/api/partners.api.ts
import { apiClient } from "@/shared/api/api-client";
import { BILLING_ENDPOINTS } from "@/shared/api/endpoints";
import { ClientPartner, ClientPartnerItem, CreateClientPartner, CreateSupplierPartner, SupplierPartner, SupplierPartnerItem, UpdatePartner } from "../models/partner";
import { GetPartnersParams, PageResponse } from "@/shared/api/types";

export const partnersApi = {
  getClients: (query? : GetPartnersParams) => 
    apiClient.get<PageResponse<ClientPartnerItem>>(BILLING_ENDPOINTS.getClients(query)),

  getSuppliers: (query? : GetPartnersParams) => 
    apiClient.get<PageResponse<SupplierPartnerItem>>(BILLING_ENDPOINTS.getSuppliers(query)),

  getClientById: (id: string) =>
    apiClient.get<ClientPartner>(BILLING_ENDPOINTS.clientById(id)),

  getSupplierById: (id: string) =>
    apiClient.get<SupplierPartner>(BILLING_ENDPOINTS.supplierById(id)),

  createClient: (payload: CreateClientPartner) =>
    apiClient.post<CreateClientPartner>(BILLING_ENDPOINTS.clients, payload),

  createSupplier: (payload: CreateSupplierPartner) =>
    apiClient.post<CreateSupplierPartner>(BILLING_ENDPOINTS.suppliers, payload),

  updateClient : (id: string, payload: UpdatePartner) => apiClient.put<UpdatePartner>(BILLING_ENDPOINTS.clientById(id), payload),

  updateSupplier : (id: string, payload: UpdatePartner) => apiClient.put<UpdatePartner>(BILLING_ENDPOINTS.supplierById(id), payload),

  deleteClient: (id: string) =>
    apiClient.delete<void>(BILLING_ENDPOINTS.clientById(id)),

  deleteSupplier: (id: string) =>
    apiClient.delete<void>(BILLING_ENDPOINTS.supplierById(id)),
};