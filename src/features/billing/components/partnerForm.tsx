"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

type PartnerFormProps<TSchema extends z.ZodTypeAny> = {
  schema: TSchema;
  defaultValues?: Partial<z.infer<TSchema>>;
  onSubmit: (values: z.infer<TSchema>) => Promise<void> | void;
  submitLabel?: string;
};

export default  function PartnerForm<TSchema extends z.ZodTypeAny>({
  schema,
  defaultValues,
  onSubmit,
  submitLabel = "Créer",
}: PartnerFormProps<TSchema>) {
  type FormValues = z.infer<TSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        <div className="md:col-span-2">
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

      <button
        disabled={isSubmitting}
        type="submit"
        className="px-5 py-3 rounded-2xl bg-gray-900 text-white font-black hover:bg-black disabled:opacity-60"
      >
        {isSubmitting ? "En cours..." : submitLabel}
      </button>
    </form>
  );
}