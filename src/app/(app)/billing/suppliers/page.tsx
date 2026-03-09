import lazyComponent from "@/shared/utils/lazyComponent";


const SuppliersList = lazyComponent(
  () => import("./suppliersList"),
  "Chargement des fournisseurs..."
);

export default function Page() {
  return <SuppliersList />;
}