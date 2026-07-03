import { RoleModalForm, RoleModalProps } from "../../widgets/roleFormModal";

export default function AddRoleModal({mode, open, onClose, onSave, permissions}:RoleModalProps) {
  return (
    <RoleModalForm 
    mode={mode}
    open={open} 
    onClose={onClose} 
    onSave={onSave} 
    permissions={permissions}    />
  )
}
