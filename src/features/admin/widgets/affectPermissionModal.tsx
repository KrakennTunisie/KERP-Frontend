"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/shared/components/ui/modal";
import { Permission, PERMISSION_CATEGORY_OPTIONS } from "../mocks/mock-permission";
import { getCategoryLabel } from "../helpers/categoryHelper";
import PermissionFormWidget from "./permissionFormWidget";

type Props = {
  open: boolean;
  rolePermissions: Permission[];
  allPermissions: Permission[];
  onClose: () => void;
  onSubmit: (permissions: Permission[]) => void;
};

export function AddPermissionModal({
  open,
  rolePermissions,
  allPermissions,
  onClose,
  onSubmit,
}: Props) {
  const [category, setCategory] = useState<Permission["category"] | "ALL">("USER");
  const [selected, setSelected] = useState<Permission[]>([]);

const availablePermissions = useMemo(() => {
  return allPermissions.filter((permission) => {
    const alreadyAssigned = rolePermissions.some(
      (rp) => rp.key === permission.key
    );

    const matchesCategory =
      permission.category === category;

    return !alreadyAssigned && matchesCategory;
  });
}, [allPermissions, rolePermissions, category]);

  const togglePermission = (perm: Permission) => {
    setSelected((prev) =>
      prev.some((p) => p.key === perm.key)
        ? prev.filter((p) => p.key !== perm.key)
        : [...prev, perm]
    );
  };

  const handleSubmit = () => {
    onSubmit(selected);
    setSelected([]);
    setCategory("USER");
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Ajouter des permissions"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="h-[34px] px-4 cursor-pointer rounded-lg border border-blue-200 text-sm text-blue-500 hover:bg-blue-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="h-[34px] px-4 cursor-pointer rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5"
          >
            <i className="ti ti-check text-sm" aria-hidden="true" />
            Enregistrer ({selected.length})
          </button>
        </div>
      }
    >
      <div className="space-y-4">

        {/* CATEGORY FILTER */}


        <div className="flex gap-1.5 flex-wrap mb-2.5">
          {PERMISSION_CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-3 py-0.5 rounded-full text-xs border transition-all ${
                category === cat.value
                  ? "bg-gray-900 text-white border-transparent"
                  : "bg-transparent cursor-pointer text-gray-500 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {getCategoryLabel(cat.value)}
            </button>
          ))}
        </div>

        {/* PERMISSION LIST */}
        <div className="max-h-72 overflow-auto border rounded-xl p-3 bg-slate-50">

          {availablePermissions.length === 0 ? (
            <p className="text-xs text-slate-400">
              Aucune permission disponible
            </p>
          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

              {availablePermissions.map((perm) => (
                <PermissionFormWidget 
                key={perm.key}
                selected={selected} 
                permission={perm} 
                togglePermission={togglePermission}/>
              ))}

            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}