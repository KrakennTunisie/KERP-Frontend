"use client";

import PaymentFormPage from "@/features/billing/components/widgets/paymentFormPage";
import { useParams } from "next/navigation";

export default function ClonePaymentPage() {
  const params = useParams();

  const paymentId = params.paymentId as string;

  return <PaymentFormPage mode="clone" paymentId={paymentId} />;
}