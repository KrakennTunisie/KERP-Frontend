import lazyComponent from "@/shared/utils/lazyComponent";


const AddUser = lazyComponent(
  () => import("@/features/admin/components/users/addUser"),
  "Chargement du formulaire..."
);

export default function NewUser() {
  return (
    <AddUser/>
  )
}
