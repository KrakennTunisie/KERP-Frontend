"use client";

import { DefaultValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import FilePicker from "@/shared/components/ui/filePicker";
import LoadingButton from "@/shared/components/ui/loadingButton";

type AnyZodObject = z.ZodObject<any, any>;

type PartnerFormProps<TSchema extends AnyZodObject> = {
  schema: TSchema;
  defaultValues?: DefaultValues<z.infer<TSchema>>;
  onSubmit: SubmitHandler<z.infer<TSchema>>;
  submitLabel?: string;
  type?: string;
};

export default function PartnerForm<TSchema extends AnyZodObject>({
  schema,
  defaultValues,
  onSubmit,
  submitLabel = "Créer",
  type = "create",
}: PartnerFormProps<TSchema>) {
  type FormValues = z.infer<TSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
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

        <div>
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
            disabled={type !== "create"}
            className={`w-full px-4 py-3 rounded-2xl font-bold
              ${
                type !== "create"
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "bg-gray-50"
              }`}
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

        <div>
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

      {type === "create" && (
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
                file={watch("rne" as any) as File | undefined}
                error={
                  errors?.["rne" as any]?.message
                    ? String(errors["rne" as any]?.message)
                    : undefined
                }
                onPick={(file) =>
                  setValue("rne" as any, file as any, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                onRemove={() =>
                  setValue("rne" as any, undefined as any, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />

              <FilePicker
                label="Contrat"
                file={watch("contract" as any) as File | undefined}
                error={
                  errors?.["contract" as any]?.message
                    ? String(errors["contract" as any]?.message)
                    : undefined
                }
                onPick={(file) =>
                  setValue("contract" as any, file as any, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                onRemove={() =>
                  setValue("contract" as any, undefined as any, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />

              <FilePicker
                label="Patente"
                file={watch("patente" as any) as File | undefined}
                error={
                  errors?.["patente" as any]?.message
                    ? String(errors["patente" as any]?.message)
                    : undefined
                }
                onPick={(file) =>
                  setValue("patente" as any, file as any, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                onRemove={() =>
                  setValue("patente" as any, undefined as any, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
          </div>
        </div>
      )}

      <LoadingButton
        disabled={isSubmitting}
        loading={isSubmitting}
        type="submit"
        form="form-partner"
        className="px-5 py-3 rounded-2xl bg-gray-900 text-white font-black hover:bg-black disabled:opacity-60 cursor-pointer"
        children={submitLabel}
        loadingText="Chargement..."
      />
    </form>
  );
}