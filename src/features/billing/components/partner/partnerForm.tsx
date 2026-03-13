"use client";

import { DefaultValues, SubmitHandler, useForm, Path, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FilePicker from "@/shared/components/ui/filePicker";
import LoadingButton from "@/shared/components/ui/loadingButton";

type AnyZodObject = z.ZodObject;

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

  const fields = {
    name: "name" as Path<FormValues>,
    email: "email" as Path<FormValues>,
    phoneNumber: "phoneNumber" as Path<FormValues>,
    taxRegistrationNumber: "taxRegistrationNumber" as Path<FormValues>,
    country: "country" as Path<FormValues>,
    adress: "adress" as Path<FormValues>,
    iban: "iban" as Path<FormValues>,
    rne: "rne" as Path<FormValues>,
    contract: "contract" as Path<FormValues>,
    patente: "patente" as Path<FormValues>,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const useFormAny = useForm as unknown as (opts: any) => ReturnType<typeof useForm<FormValues>>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useFormAny({
    resolver: zodResolver(schema),
    defaultValues,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setValueAny = setValue as (field: string, value: unknown, options?: object) => void;

  const getError = (field: Path<FormValues>) => {
    const err = (errors as FieldErrors<Record<string, unknown>>)[field];
    return err?.message ? String(err.message) : undefined;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="form-partner" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { field: fields.name, placeholder: "Nom" },
          { field: fields.email, placeholder: "Email" },
          { field: fields.phoneNumber, placeholder: "Téléphone" },
          { field: fields.country, placeholder: "Pays" },
          { field: fields.adress, placeholder: "Adresse" },
        ].map(({ field, placeholder }) => (
          <div key={field}>
            <input
              {...register(field)}
              placeholder={placeholder}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 font-bold"
            />
            {getError(field) && (
              <p className="text-xs text-red-600 mt-1">{getError(field)}</p>
            )}
          </div>
        ))}

        <div>
          <input
            {...register(fields.taxRegistrationNumber)}
            placeholder="Matricule fiscal"
            disabled={type !== "create"}
            className={`w-full px-4 py-3 rounded-2xl font-bold ${type !== "create" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-gray-50"
              }`}
          />
          {getError(fields.taxRegistrationNumber) && (
            <p className="text-xs text-red-600 mt-1">{getError(fields.taxRegistrationNumber)}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <input
            {...register(fields.iban)}
            placeholder="IBAN"
            className="w-full px-4 py-3 rounded-2xl bg-gray-50 font-bold"
          />
          {getError(fields.iban) && (
            <p className="text-xs text-red-600 mt-1">{getError(fields.iban)}</p>
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
            {[
              { field: fields.rne, label: "RNE" },
              { field: fields.contract, label: "Contrat" },
              { field: fields.patente, label: "Patente" },
            ].map(({ field, label }) => (
              <FilePicker
                key={field}
                label={label}
                file={watch(field) as File | undefined}
                error={getError(field)}
                onPick={(file) => setValueAny(field, file, { shouldValidate: true, shouldDirty: true })}
                onRemove={() => setValueAny(field, undefined, { shouldValidate: true, shouldDirty: true })}
              />
            ))}
          </div>
        </div>
      )}

      <LoadingButton
        disabled={isSubmitting}
        loading={isSubmitting}
        type="submit"
        form="form-partner"
        className="px-5 py-3 rounded-2xl bg-gray-900 text-white font-black hover:bg-black disabled:opacity-60 cursor-pointer"
        loadingText="Chargement..."
      >
        {submitLabel}
      </LoadingButton>
    </form>
  );
}