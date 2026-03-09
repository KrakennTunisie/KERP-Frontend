import lazyComponent from "@/shared/utils/lazyComponent";


const ClientsList = lazyComponent(
  () => import("./clientsList"),
  "Chargement des clients..."
);

export default function Page() {
  return <ClientsList />;
}