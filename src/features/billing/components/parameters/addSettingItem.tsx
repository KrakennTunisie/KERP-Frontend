"use client";

import { useEffect } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal } from "@/shared/components/ui/modal";
import { CreateSetting } from "../../models/SettingItem";
import { SettingType } from "../../types/settingType";
import { CreateOperationCategorySchema } from "../../models/operationCategory";
import { CreatePaymentConditionSchema } from "../../models/paymentCondition";
import { CreateTVARateSchema } from "../../models/TVArate";

const createSchemaMap = {
  OPERATION_CATEGORY: CreateOperationCategorySchema,
  PAYMENT_CONDITION: CreatePaymentConditionSchema,
  TVA_RATE: CreateTVARateSchema,
} as const;

type AddSettingModalProps = {
  open: boolean;
  title: string;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSetting) => void;
  settingType: SettingType
};

export default function AddSettingModal({
  open,
  title,
  loading = false,
  onClose,
  onSubmit,
  settingType
}: AddSettingModalProps) {



const schema = createSchemaMap[settingType];
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSetting>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      code: "",
      label: "",
      description: "",
      settingType: settingType,
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const submit = (data: CreateSetting) => {
    console.log("errors", errors)
    onSubmit(data);
    reset();
  };


  return (
    <Modal
      open={open}
      title={title}
      onClose={() => {
        reset();
        onClose();
      }}
      footer={
        <>
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              reset();
              onClose();
            }}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            Annuler
          </button>

          <button
            type="submit"
            form="add-setting-form"
            disabled={loading }
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            <Plus className="h-4 w-4" />
            {loading ? "Création..." : "Créer"}
          </button>
        </>
      }
    >
      <form
        id="add-setting-form"
        onSubmit={handleSubmit(submit)}
        className="space-y-5"
      >
        {/* Code */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Code <span className="text-rose-500">*</span>
          </label>

          <input
            {...register("code")}
            placeholder="Ex : SALE"
            className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition
              ${
                errors.code
                  ? "border-rose-500 focus:border-rose-500"
                  : "border-slate-300 focus:border-blue-500"
              }`}
          />

          {errors.code && (
            <p className="mt-1 text-xs text-rose-500">
              {errors.code.message}
            </p>
          )}
        </div>

        {/* Label */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Libellé <span className="text-rose-500">*</span>
          </label>

          <input
            {...register("label")}
            placeholder="Ex : Vente"
            className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition
              ${
                errors.label
                  ? "border-rose-500 focus:border-rose-500"
                  : "border-slate-300 focus:border-blue-500"
              }`}
          />

          {errors.label && (
            <p className="mt-1 text-xs text-rose-500">
              {errors.label.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            {...register("description")}
            rows={4}
            placeholder="Décrivez cet élément..."
            className={`w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none transition
              ${
                errors.description
                  ? "border-rose-500 focus:border-rose-500"
                  : "border-slate-300 focus:border-blue-500"
              }`}
          />

          {errors.description && (
            <p className="mt-1 text-xs text-rose-500">
              {errors.description.message}
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}