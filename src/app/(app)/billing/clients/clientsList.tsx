// src/app/(app)/billing/clients/ClientsListClient.tsx
"use client";

import ClientsList from "@/features/billing/components/client/clientsList";
import { partnerTypeSchema } from "@/features/billing/types/partnerType";

export default function ClientsListClient() {
  return <ClientsList partnerType={partnerTypeSchema.enum.CLIENT} />;
}