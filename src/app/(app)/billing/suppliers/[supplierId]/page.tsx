import lazyComponent from "@/shared/utils/lazyComponent";


const SupplierDtails = lazyComponent(
  () => import("@/features/billing/components/supplier/supplierDetails"),
  "Chargement de détails fournisseur..."
);

export default function Page() {
  return <SupplierDtails />;
}