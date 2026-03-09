import lazyComponent from "@/shared/utils/lazyComponent";


const ClientDetails = lazyComponent(
  () => import("@/features/billing/components/client/clientDetails"),
  "Chargement de détails client..."
);

export default function Page() {
  return <ClientDetails />;
}