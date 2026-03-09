"use client";

import { DefaultValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import FilePicker from "@/shared/components/ui/filePicker";
import { CreateSupplierPartner } from "../models/partner";

type PartnerFormProps<TSchema extends z.ZodTypeAny> = {
  schema: TSchema;
  defaultValues?: DefaultValues<z.infer<TSchema>>;
  onSubmit: SubmitHandler<z.infer<TSchema>>;
  submitLabel?: string;
};

export default function PartnerForm<TSchema extends z.ZodTypeAny>({
  schema,
  defaultValues,
  onSubmit,
  submitLabel = "Créer",
}: PartnerFormProps<TSchema>) {
  type FormValues = z.infer<TSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });


return (
  <form onSubmit={handleSubmit(onSubmit)} id="form-partner" className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <input
          {...register("name" as any)}
          placeholder="Nom"
          className="w-full px-4 py-3 rounded-2xl bg-gray-50 font-bold"
        />
        {errors?.["name" as any]?.message && (
          <p className="text-xs text-red-600 mt-1">
            {String(errors["name" as any]?.message)}
          </p>
        )}
      </div>
      
      <div >
        <input
          {...register("email" as any)}
          placeholder="Email"
          className="w-full px-4 py-3 rounded-2xl bg-gray-50 font-bold"
        />
        {errors?.["email" as any]?.message && (
          <p className="text-xs text-red-600 mt-1">
            {String(errors["email" as any]?.message)}
          </p>
        )}
        </div>

      <div>
        <input
          {...register("phoneNumber" as any)}
          placeholder="Téléphone"
          className="w-full px-4 py-3 rounded-2xl bg-gray-50 font-bold"
        />
        {errors?.["phoneNumber" as any]?.message && (
          <p className="text-xs text-red-600 mt-1">
            {String(errors["phoneNumber" as any]?.message)}
          </p>
        )}
      </div>

      <div>
        <input
          {...register("taxRegistrationNumber" as any)}
          placeholder="Matricule fiscal"
          className="w-full px-4 py-3 rounded-2xl bg-gray-50 font-bold"
        />
        {errors?.["taxRegistrationNumber" as any]?.message && (
          <p className="text-xs text-red-600 mt-1">
            {String(errors["taxRegistrationNumber" as any]?.message)}
          </p>
        )}
      </div>

      <div>
        <input
          {...register("country" as any)}
          placeholder="Pays"
          className="w-full px-4 py-3 rounded-2xl bg-gray-50 font-bold"
        />
        {errors?.["country" as any]?.message && (
          <p className="text-xs text-red-600 mt-1">
            {String(errors["country" as any]?.message)}
          </p>
        )}
      </div>

      <div >
        <input
          {...register("adress" as any)}
          placeholder="Adresse"
          className="w-full px-4 py-3 rounded-2xl bg-gray-50 font-bold"
        />
        {errors?.["adress" as any]?.message && (
          <p className="text-xs text-red-600 mt-1">
            {String(errors["adress" as any]?.message)}
          </p>
        )}
      </div>



      <div className="md:col-span-2">
        <input
          {...register("iban" as any)}
          placeholder="IBAN"
          className="w-full px-4 py-3 rounded-2xl bg-gray-50 font-bold"
        />
        {errors?.["iban" as any]?.message && (
          <p className="text-xs text-red-600 mt-1">
            {String(errors["iban" as any]?.message)}
          </p>
        )}
      </div>
    </div>

    {/* Documents */}
    <div className="space-y-3">
      <div>
        <p className="text-sm font-black text-gray-900">Documents obligatoires</p>
        <p className="text-xs font-semibold text-gray-500 mt-1">
          Veuillez joindre les 3 documents requis avant de créer le partenaire.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FilePicker
          label="RNE"
          file={watch("rne" as any)}
          error={errors?.["rne" as any]?.message ? String(errors["rne" as any]?.message) : undefined}
          onPick={(file) =>
            setValue("rne" as any, file, { shouldValidate: true, shouldDirty: true })
          }
          onRemove={() =>
            setValue("rne" as any, undefined, { shouldValidate: true, shouldDirty: true })
          }
        />

        <FilePicker
          label="Contrat"
          file={watch("contract" as any)}
          error={errors?.["contract" as any]?.message ? String(errors["contract" as any]?.message) : undefined}
          onPick={(file) =>
            setValue("contract" as any, file, { shouldValidate: true, shouldDirty: true })
          }
          onRemove={() =>
            setValue("contract" as any, undefined, { shouldValidate: true, shouldDirty: true })
          }
        />

        <FilePicker
          label="Patente"
          file={watch("patente" as any)}
          error={errors?.["patente" as any]?.message ? String(errors["patente" as any]?.message) : undefined}
          onPick={(file) =>
            setValue("patente" as any, file, { shouldValidate: true, shouldDirty: true })
          }
          onRemove={() =>
            setValue("patente" as any, undefined, { shouldValidate: true, shouldDirty: true })
          }
        />
      </div>
    </div>

    <button
      disabled={isSubmitting}
      type="submit"
      form="form-partner"
      className="px-5 py-3 rounded-2xl bg-gray-900 text-white font-black hover:bg-black disabled:opacity-60"
    >
      {isSubmitting ? "En cours..." : submitLabel}
    </button>
  </form>
);
}