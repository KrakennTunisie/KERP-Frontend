"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/shared/components/ui/modal";
import { Permission, PERMISSION_CATEGORY_OPTIONS } from "../mocks/mock-permission";
import { getCategoryLabel } from "../helpers/categoryHelper";

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
        <>
          <button
            onClick={onClose}
            className=" cursor-pointer rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600"
          >
            Annuler
          </button>

          <button
            onClick={handleSubmit}
            className="cursor-pointer rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Ajouter ({selected.length})
          </button>
        </>
      }
    >
      <div className="space-y-4">

        {/* CATEGORY FILTER */}
        <div>
          <label className="text-xs font-semibold text-slate-600">
            Catégorie
          </label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as Permission["category"] | "ALL")
            }
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="ALL">Toutes les catégories</option>
            {PERMISSION_CATEGORY_OPTIONS.map((option)=>(
              <option key={option.value} value={option.value}>{getCategoryLabel(option.label)}</option>
            ))}
          </select>
        </div>

        {/* PERMISSION LIST */}
        <div className="max-h-72 overflow-auto border rounded-xl p-3 bg-slate-50">

          {availablePermissions.length === 0 ? (
            <p className="text-xs text-slate-400">
              Aucune permission disponible
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

              {availablePermissions.map((perm) => {
                const isSelected = selected.some((p) => p.key === perm.key);

                return (
                  <button
                    key={perm.key}
                    type="button"
                    onClick={() => togglePermission(perm)}
                    className={`
                      group w-full text-left rounded-xl border p-3 text-xs
                      transition-all duration-200
                      flex flex-col justify-between gap-2 min-h-[92px]

                      ${
                        isSelected
                          ? "bg-violet-50 border-violet-200 shadow-sm"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }
                    `}
                  >

                    {/* HEADER ROW */}
                    <div className="flex items-start justify-between gap-2">

                      {/* TITLE */}
                      <div className="flex items-start gap-2">

                        {/* SELECTION DOT */}
                        <div
                          className={`
                            mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center
                            ${
                              isSelected
                                ? "border-violet-500 bg-violet-500"
                                : "border-slate-300 bg-white group-hover:border-slate-400"
                            }
                          `}
                        >
                          {isSelected && (
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                          )}
                        </div>

                        <div>
                          <p
                            className={`
                              font-medium text-xs leading-snug
                              ${isSelected ? "text-violet-700" : "text-slate-800"}
                            `}
                          >
                            {perm.label}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {perm.key}
                          </p>
                        </div>

                      </div>

                      {/* CATEGORY BADGE */}
                      <span
                        className={`
                          shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold border
                          ${
                            isSelected
                              ? "bg-violet-100 text-violet-700 border-violet-200"
                              : "bg-slate-50 text-slate-500 border-slate-200"
                          }
                        `}
                      >
                        {getCategoryLabel(perm.category)}
                      </span>
                    </div>

                  </button>
                );
              })}

            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}