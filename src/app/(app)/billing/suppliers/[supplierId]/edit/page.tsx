import AddPartnerPage from "@/features/billing/components/partner/addPartner";
import {supplierProps } from "@/features/billing/hooks/useCreatePartner";
import lazyComponent from "@/shared/utils/lazyComponent";


const SupplierDtails = lazyComponent(
  () => import("@/features/billing/components/supplier/supplierDetails"),
  "Chargement de détails fournisseur..."
);

export default async function Page({ params }: supplierProps) {
   const {supplierId} = await params
   return <AddPartnerPage type={"SUPPLIER"} mode ="edit" partnerId={supplierId} />
}