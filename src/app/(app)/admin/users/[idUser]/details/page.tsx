import lazyComponent from "@/shared/utils/lazyComponent";


const DetailsUser = lazyComponent(
  () => import("@/features/admin/components/users/detailsUser"),
  "Chargement du formulaire..."
);


export default function DetailsPage() {
  return (
    <DetailsUser />
  )
}