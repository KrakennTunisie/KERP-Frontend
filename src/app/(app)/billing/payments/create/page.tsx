"use client";

import CreatePaymentPage from "@/features/billing/components/payment/createPayment";
import { useSearchParams } from "next/navigation";

export type PaymentPageProps = {
  invoiceId?: string|null
}

export default function Payments() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoiceId");
  return(
    <CreatePaymentPage invoiceId={invoiceId}/>
  );
}