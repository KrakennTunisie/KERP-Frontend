import dynamic from "next/dynamic";

const ClientsListClient = dynamic(
  () => import("./suppliersList"),
  { loading: () => <div className="p-8 font-bold">Loading...</div> }
);

export default function Page() {
  return <ClientsListClient />;
}