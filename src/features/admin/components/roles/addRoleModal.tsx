import { usePermissionsList } from "../../hooks/usePermissionsList";
import { RoleModalForm, RoleModalProps } from "../../widgets/roleFormModal";

export default function AddRoleModal({loading, mode, open, onClose, onSave, form}:RoleModalProps) {

  const {permissions}= usePermissionsList()
  return (
    <RoleModalForm 
    loading={loading}
    form={form}
    mode={mode}
    open={open} 
    onClose={onClose} 
    onSave={onSave} 
    permissions={permissions}    />
  )
}
