import { userProps } from "@/features/admin/components/users/userForm";
import lazyComponent from "@/shared/utils/lazyComponent";


const DetailsUser = lazyComponent(
  () => import("@/features/admin/components/users/detailsUser"),
  "Chargement du formulaire..."
);


export default async function DetailsPage({params}:userProps) {
  const {idUser}= await params

  console.log("idUser", idUser)
  return (
    <DetailsUser params={{"idUser" : idUser}}/>
  )
}