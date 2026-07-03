"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/shared/components/ui/modal";
import { Permission } from "../mocks/mock-permission";
import { getCategoryLabel } from "../helpers/categoryHelper";

export type PermissionCategory = string;

type PermissionFormValues = {
  key: string;
  label: string;
  description: string;
};

export type PermissionFormModalProps = {
  mode: "create" | "edit";
  open: boolean;
  onClose: () => void;
  onSave: (data: PermissionFormValues) => void;

  category: PermissionCategory;

  permission?: Permission;
};

export function PermissionFormModal({
  mode,
  open,
  onClose,
  onSave,
  category,
  permission,
}: PermissionFormModalProps) {
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PermissionFormValues>({
    defaultValues: {
      key: "",
      label: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        key: permission?.key ?? "",
        label: permission?.label ?? "",
        description: permission?.description ?? "",
      });
    }
  }, [open, permission, reset]);

  const onSubmit = (data: PermissionFormValues) => {
    onSave(data);
    onClose();
  };

  const title =
    mode === "create"
      ? `Ajouter une permission : ${getCategoryLabel(category)}`
      : "Modifier la permission";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-[34px] px-4 cursor-pointer rounded-lg border border-blue-200 text-sm text-blue-500 hover:bg-blue-50 transition-colors"
          >
            Annuler
          </button>

          <button
            type="submit"
            form="permission-form"
            className="h-[34px] px-4 cursor-pointer rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-800 transition-colors flex items-center gap-1.5"
          >
            <i className="ti ti-check text-sm" />
            {mode === "create" ? "Créer" : "Enregistrer"}
          </button>
        </div>
      }
    >
      <form
        id="permission-form"
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
            placeholder="ex. USER_CREATE"
            className="h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100 transition-all disabled:bg-gray-50 disabled:text-gray-400"
          />

          <span className="text-[11px] text-gray-400">
            Identifiant unique utilisé côté backend.
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
            placeholder="ex. Créer un utilisateur"
            className="h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100 transition-all"
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
            placeholder="Décrivez l'utilité de cette permission..."
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-gray-100 transition-all"
          />
        </div>
      </form>
    </Modal>
  );
}