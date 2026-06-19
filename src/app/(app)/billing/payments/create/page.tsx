import { Suspense } from "react";
import CreatePayment from "./create";

export default function PaymentsPage() {
  return (
    <Suspense fallback={null}>
      <CreatePayment />
    </Suspense>
  );
}