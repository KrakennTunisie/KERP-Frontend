//import EditUser from "@/features/admin/components/users/editUser";
import  { userProps } from "@/features/admin/components/users/userForm";
import lazyComponent from "@/shared/utils/lazyComponent";


const EditUser = lazyComponent(
  () => import("@/features/admin/components/users/editUser"),
  "Chargement du formulaire..."
);

export default async function Page({params}: userProps) {

  const {idUser}= await params
  console.log("idUser", idUser)
  return (

    <EditUser  params={{"idUser" : idUser}}/>

  )
}