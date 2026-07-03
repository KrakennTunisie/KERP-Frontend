import lazyComponent from "@/shared/utils/lazyComponent";

const PermissionsPage = lazyComponent(
  () => import("@/features/admin/components/permissions/listPermissions"),
  "Chargement des permissions..."
);
export default function permissions(){
    return (
        <PermissionsPage/>
    )
}