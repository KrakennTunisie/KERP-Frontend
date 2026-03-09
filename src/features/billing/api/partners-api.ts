// src/features/billing/api/partners.api.ts
import { apiClient } from "@/shared/api/api-client";
import { BILLING_ENDPOINTS } from "@/shared/api/endpoints";
import { ClientPartner, ClientPartnerItem, CreateClientPartner, CreateSupplierPartner, SupplierPartner, SupplierPartnerItem } from "../models/partner";

export const partnersApi = {
  getClients: () => apiClient.get<ClientPartnerItem[]>(BILLING_ENDPOINTS.clients),

  getSuppliers: () => apiClient.get<SupplierPartnerItem[]>(BILLING_ENDPOINTS.suppliers),

  getClientById: (id: string) =>
    apiClient.get<ClientPartner>(BILLING_ENDPOINTS.clientById(id)),

  getSupplierById: (id: string) =>
    apiClient.get<SupplierPartner>(BILLING_ENDPOINTS.supplierById(id)),

  createClient: (payload: unknown) =>
    apiClient.post<CreateClientPartner>(BILLING_ENDPOINTS.clients, payload),

  createSupplier: (payload: unknown) =>
    apiClient.post<CreateSupplierPartner>(BILLING_ENDPOINTS.suppliers, payload),

  deleteClient: (id: string) =>
    apiClient.delete<void>(BILLING_ENDPOINTS.clientById(id)),

  deleteSupplier: (id: string) =>
    apiClient.delete<void>(BILLING_ENDPOINTS.supplierById(id)),
};