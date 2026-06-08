"use client";

import SuppliersList from "@/features/billing/components/supplier/suppliersList";
import { partnerTypeSchema } from "@/features/billing/types/partnerType";

export default function ClientsListClient() {
  return <SuppliersList partnerType={partnerTypeSchema.enum.SUPPLIER} />;
}