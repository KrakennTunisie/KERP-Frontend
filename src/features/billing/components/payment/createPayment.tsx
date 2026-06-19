"use client";

import { PaymentPageProps } from "@/app/(app)/billing/payments/create/page";
import PaymentFormPage from "../widgets/paymentFormPage";



export default function CreatePaymentPage({invoiceId}: PaymentPageProps) {
  return <PaymentFormPage mode="create" invoiceId={invoiceId}/>;
}