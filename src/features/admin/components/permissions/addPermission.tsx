'use client'

import { PermissionFormModal, PermissionFormModalProps } from "../../widgets/permissionForm";

export default function AddPermission({mode="create", open, onClose, onSave, category}:PermissionFormModalProps) {
  return (
    <PermissionFormModal 
        mode={mode} 
        open={open} 
        onClose={onClose} 
        onSave={onSave}
        category={category}        
        />
  )
}
