"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/shared/components/ui/modal";

export type PermissionCategory = {
  key: string;
  label: string;
  description?: string;
  icon?: string;
};

type CategoryFormModalProps = {
  mode: "create" | "edit";
  open: boolean;
  onClose: () => void;
  onSave: (category: PermissionCategory) => void;

  category?: PermissionCategory;
};

export function CategoryFormModal({
  mode,
  open,
  onClose,
  onSave,
  category,
}: CategoryFormModalProps) {
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PermissionCategory>({
    defaultValues: {
      key: "",
      label: "",
      description: "",
      icon: "ti-folder",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        key: category?.key ?? "",
        label: category?.label ?? "",
        description: category?.description ?? "",
        icon: category?.icon ?? "ti-folder",
      });
    }
  }, [open, category, reset]);

  const onSubmit = (data: PermissionCategory) => {
    onSave({
      ...data,
      key: data.key.trim().toUpperCase(),
      label: data.label.trim(),
      description: data.description?.trim() ?? "",
      icon: data.icon || "ti-folder",
    });

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        isEdit
          ? "Modifier la catégorie"
          : "Créer une catégorie"
      }
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-[34px] px-4 rounded-lg border border-blue-200 text-sm text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
          >
            Annuler
          </button>

          <button
            type="submit"
            form="category-form"
            className="h-[34px] px-4 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <i className="ti ti-check text-sm" />
            {isEdit ? "Enregistrer" : "Créer"}
          </button>
        </div>
      }
    >
      <form
        id="category-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* Key */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">
            Clé technique
          </label>

          <input
            {...register("key", {
              required: "La clé technique est obligatoire",
            })}
            disabled={isEdit}
            placeholder="ex. USERS"
            className="h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50 disabled:text-gray-400"
          />

          <span className="text-[11px] text-gray-400">
            Identifiant unique de la catégorie.
          </span>

          {errors.key && (
            <span className="text-xs text-red-500">
              {errors.key.message}
            </span>
          )}
        </div>

        {/* Label */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">
            Libellé
          </label>

          <input
            {...register("label", {
              required: "Le libellé est obligatoire",
            })}
            placeholder="ex. Gestion des utilisateurs"
            className="h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100"
          />

          {errors.label && (
            <span className="text-xs text-red-500">
              {errors.label.message}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">
            Description
            <span className="font-normal text-gray-400">
              {" "}
              (optionnelle)
            </span>
          </label>

          <textarea
            {...register("description")}
            rows={3}
            placeholder="Décrivez cette catégorie..."
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-gray-100"
          />
        </div>
      </form>
    </Modal>
  );
}