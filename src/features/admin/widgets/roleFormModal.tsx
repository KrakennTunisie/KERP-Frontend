"use client";

import { useMemo, useState } from "react";
import { Role } from "../mocks/mock-roles";
import { Permission } from "../mocks/mock-permission";
import { Modal } from "@/shared/components/ui/modal";
import { getCategoryLabel } from "../helpers/categoryHelper";

export type RoleModalProps = {
  mode: "edit" | "create";
  open: boolean;
  onClose: () => void;
  onSave: (role: Omit<Role, "id">) => void;
  permissions: Permission[];
};


const PERM_ICONS: Record<string, string> = {
  inv_read: "ti-file-invoice",
  inv_create: "ti-file-plus",
  inv_delete: "ti-trash",
  po_read: "ti-shopping-cart",
  po_create: "ti-cart-plus",
  user_manage: "ti-users",
  role_manage: "ti-shield",
  settings: "ti-settings",
};

export function RoleModalForm({
  mode,
  open,
  onClose,
  onSave,
  permissions,
}: RoleModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  );

  const categories = useMemo(() => {
    const cats = Array.from(new Set(permissions.map((p) => p.category)));
    return ["ALL", ...cats];
  }, [permissions]);

  const filteredPermissions = useMemo(() => {
    if (activeCategory === "ALL") return permissions;
    return permissions.filter((p) => p.category === activeCategory);
  }, [permissions, activeCategory]);

  const togglePermission = (key: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSave = () => {
    onSave({
      name,
      description,
      color,
      permissions: permissions.filter((p) => selectedPermissions.has(p.key)),
    });
    setName("");
    setDescription("");
    setColor("#3b82f6");
    setSelectedPermissions(new Set());
    setActiveCategory("ALL");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Créer un rôle" : "Modifier le rôle"}
      footer={
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="h-[34px] px-4 cursor-pointer rounded-lg border border-blue-200 text-sm text-blue-500 hover:bg-blue-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="h-[34px] px-4 cursor-pointer rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-800 transition-colors flex items-center gap-1.5"
          >
            <i className="ti ti-check text-sm" aria-hidden="true" />
            Enregistrer
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">

        {/* Nom + Couleur */}
        <div className="grid grid-cols-[1fr_auto] gap-2.5 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">
              Nom du rôle
            </label>
            <input
              className="h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100  transition-all"
              placeholder="ex. Comptable"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">
            Description{" "}
            <span className="font-normal text-gray-400">(optionnelle)</span>
          </label>
          <textarea
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-gray-100  transition-all"
            placeholder="Décrivez les responsabilités de ce rôle…"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Permissions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-500">
              Permissions
            </label>
            <span className="text-xs text-gray-400">
              {selectedPermissions.size} sélectionnée(s)
            </span>
          </div>

          {/* Onglets catégories */}
          <div className="flex gap-1.5 flex-wrap mb-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-0.5 rounded-full text-xs border transition-all ${
                  activeCategory === cat
                    ? "bg-gray-900 text-white border-transparent"
                    : "bg-transparent cursor-pointer text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>

          {/* Liste permissions */}
          <div className="border border-gray-100 rounded-lg max-h-[200px] overflow-y-auto bg-gray-50 divide-y divide-gray-100 scrollbar-thin">
            {filteredPermissions.map((perm) => {
              const checked = selectedPermissions.has(perm.key);
              const icon = PERM_ICONS[perm.key] ?? "ti-lock";

              return (
                <label
                  key={perm.key}
                  onClick={() => togglePermission(perm.key)}
                  className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer hover:bg-white transition-colors"
                >
                  {/* Checkbox custom */}
                  <span
                    className={`w-4 h-4 rounded-[4px] flex items-center justify-center flex-shrink-0 transition-all border ${
                      checked
                        ? "bg-blue-600 border-transparent"
                        : "bg-transparent border-blue-300"
                    }`}
                  >
                    {checked && (
                      <i
                        className="ti ti-check text-white"
                        aria-hidden="true"
                      />
                    )}
                  </span>

                  {/* Icône permission */}
                  <i
                    className={`ti ${icon} text-blue-400`}
                    style={{ fontSize: 15 }}
                    aria-hidden="true"
                  />

                  {/* Label */}
                  <span className="text-sm text-gray-800 flex-1">
                    {perm.label}
                  </span>

                  {/* Badge catégorie */}
                  <span className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 bg-white text-gray-400">
                    {getCategoryLabel(perm.category)}
                  </span>
                </label>
              );
            })}

            {filteredPermissions.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">
                Aucune permission dans cette catégorie
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}