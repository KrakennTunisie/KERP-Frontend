import lazyComponent from "@/shared/utils/lazyComponent";


const EditUser = lazyComponent(
  () => import("@/features/admin/components/users/editUser"),
  "Chargement du formulaire..."
);

export default function UpdateUser() {
  return (
    <EditUser/>
  )
}