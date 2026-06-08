"use client";

import { useParams } from "next/navigation";
import PaymentFormPage from "../widgets/paymentFormPage";

export default function UpdatePaymentPage() {
  const params = useParams();

  const paymentId = params.paymentId as string;

  return <PaymentFormPage mode="update" paymentId={paymentId} />;
}